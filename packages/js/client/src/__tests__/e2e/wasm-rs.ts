import {
  Web3ApiClientConfig,
  createWeb3ApiClient,
} from "../../";
import * as TestCases from "./test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(1200000);

describe("wasm-rs test cases", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const testEnv = await initTestEnvironment();
    ipfsProvider = testEnv.ipfs;
    ethProvider = testEnv.ethereum;
    ensAddress = testEnv.ensAddress;
    ensRegistrarAddress = testEnv.registrarAddress;
    ensResolverAddress = testEnv.resolverAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      },
      ipfs: { provider: ipfsProvider },
      ens: { query: {
        addresses: {
          testnet: ensAddress,
        },
      } },
    }, config);
  }

  const deployApi = (apiAbsPath: string) =>
    buildAndDeployApi({
      apiAbsPath,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress,
      ensResolverAddress,
      ethereumProvider: ethProvider,
    });

  it("asyncify", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/asyncify`
    );

    await TestCases.runAsyncifyTest(
      await getClient(), api
    );
  });

  it("bigint-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/bigint-type`
    );

    await TestCases.runBigIntTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("bignumber-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/bignumber-type`
    );

    await TestCases.runBigNumberTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("bytes-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/bytes-type`
    );

    await TestCases.runBytesTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("enum-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/enum-types`
    );

    await TestCases.runEnumTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("map-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/map-type`
    );

    await TestCases.runMapTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("implementations - e2e", async () => {
    let interfaceApi = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/implementations/test-interface`
    );
    const interfaceUri = `w3://ens/testnet/${interfaceApi.ensDomain}`;

    const implementationApi = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/implementations/test-api`
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    await TestCases.runImplementationsTest(
      client, interfaceUri, implementationUri
    );
  });

  it("implementations - getImplementations", async () => {
    const interfaceUri = "w3://ens/interface.eth"

    const implementationApi = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/implementations/test-use-getImpl`
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: "w3://ens/interface.eth",
          implementations: [implementationUri],
        }
      ],
    });

    await TestCases.runGetImplementationsTest(
      client, interfaceUri, implementationUri
    );
  });

  it("invalid type errors", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/invalid-types`
    );

    await TestCases.runInvalidTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("JSON-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/json-type`
    );

    await TestCases.runJsonTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("large-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/large-types`
    );

    await TestCases.runLargeTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("number-types under and overflows", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/number-types`
    );

    await TestCases.runNumberTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("object-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/object-types`
    );

    await TestCases.runObjectTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("simple-storage", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-rs/simple-storage`
    );

    await TestCases.runSimpleStorageTest(
      await getClient(), api
    );
  });
});
