import { step } from "../../helpers";
import { intlMsg } from "../../intl";
import { AnyProjectManifest, Project } from "../../project";
import {
  isTypescriptFile,
  importTypescriptModule,
  resetDir,
} from "../../system";
import { CodegenStrategy } from "../CodegenStrategy";
import { SchemaComposer } from "../../SchemaComposer";

import { writeDirectorySync } from "@polywrap/os-js";
import { BindLanguage, GenerateBindingFn } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/wrap-manifest-types-js";
import { readFileSync } from "fs-extra";
import Mustache from "mustache";
import { Ora } from "ora";
import path from "path";

export class ScriptCodegenStrategy extends CodegenStrategy {
  private _abi: Abi;
  private _script: string;
  private _mustacheView: Record<string, unknown> | undefined;
  private _codegenDirAbs: string;
  private _omitHeader: boolean;
  private _schema: string | undefined = "";

  constructor(config: {
    project: Project<AnyProjectManifest>;
    schemaComposer: SchemaComposer;
    codegenDirAbs: string;
    script: string;
    mustacheView: Record<string, unknown> | undefined;
    omitHeader: boolean;
    schema?: string;
  }) {
    super(config);

    this._script = config.script;
    this._mustacheView = config.mustacheView;
    this._codegenDirAbs = config.codegenDirAbs;
    this._omitHeader = config.omitHeader;

    if (config.schema) {
      this._schema = config.schema;
    }
  }

  public async generate(
    bindLanguage: BindLanguage,
    spinner?: Ora
  ): Promise<string[]> {
    // Check the generation file if it has the proper run() method
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const generator = isTypescriptFile(this._script)
      ? await importTypescriptModule(this._script)
      : // eslint-disable-next-line @typescript-eslint/no-require-imports
        await require(this._script);

    if (!generator) {
      throw Error(intlMsg.lib_codeGenerator_wrongGenFile());
    }

    const { generateBinding } = generator as {
      generateBinding: GenerateBindingFn;
    };
    if (!generateBinding) {
      throw Error(intlMsg.lib_codeGenerator_nogenerateBindingMethod());
    }

    const binding = await generateBinding({
      projectName: await this.project.getName(),
      abi: this._abi,
      outputDirAbs: this._codegenDirAbs,
      bindLanguage,
      config: this._mustacheView,
    });

    resetDir(this._codegenDirAbs);
    return writeDirectorySync(
      this._codegenDirAbs,
      binding.output,
      (templatePath: string) => this._generateTemplate(templatePath, spinner)
    );
  }

  private _generateTemplate(
    templatePath: string,
    config: unknown,
    spinner?: Ora
  ): string {
    if (!this.project.quiet && spinner) {
      const stepMessage = intlMsg.lib_codeGenerator_genTemplateStep({
        path: `${templatePath}`,
      });
      step(spinner, stepMessage);
    }

    if (this._script) {
      // Update template path when the generation file is given
      templatePath = path.join(path.dirname(this._script), templatePath);
    }

    const template = readFileSync(templatePath);
    const types =
      typeof config === "object" && config !== null ? config : { config };
    let content = Mustache.render(template.toString(), {
      ...types,
      schema: this._schema,
      ...this._mustacheView,
    });

    if (this._omitHeader) {
      return content;
    }

    content = `// ${intlMsg.lib_codeGenerator_templateNoModify()}

${content}
`;

    return content;
  }
}
