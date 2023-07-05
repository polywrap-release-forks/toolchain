package test_import

import (
	"github.com/polywrap/go-wrap/polywrap/msgpack"
)

type TestImport_Env struct {
	Object         TestImport_AnotherObject
	OptObject      *TestImport_AnotherObject
	ObjectArray    []TestImport_AnotherObject
	OptObjectArray []*TestImport_AnotherObject
	En             TestImport_Enum
	OptEnum        *TestImport_Enum
	EnumArray      []TestImport_Enum
	OptEnumArray   []*TestImport_Enum
}

func TestImport_EnvToBuffer(value *TestImport_Env) []byte {
	return serializeTestImport_Env(value)
}

func TestImport_EnvFromBuffer(data []byte) *TestImport_Env {
	return deserializeTestImport_Env(data)
}

func TestImport_EnvWrite(writer msgpack.Write, value *TestImport_Env) {
	writeTestImport_Env(writer, value)
}

func TestImport_EnvRead(reader msgpack.Read) *TestImport_Env {
	return readTestImport_Env(reader)
}
