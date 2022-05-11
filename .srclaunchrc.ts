import {
  BrowserPackage,
  BuildFormat,
  BuildPlatform,
  BuildTarget,
  BuildTool,
  CodeFormatterTool,
  CodeLinterTool,
  License,
  Project,
  ProjectType,
  PublishAccess,
  StaticTypingTool,
  TestReporter,
  TestTool,
  UniversalPackage,
} from "@srclaunch/types";

export default <Project>{
  name: "@srclaunch/validation",
  description:
    "Form/value/etc validation library used in AppLab applications and services",
  type: ProjectType.Library,
  environments: {
    development: {
      formatters: [CodeFormatterTool.Prettier],
      linters: [CodeLinterTool.ESLint],
      staticTyping: [StaticTypingTool.TypeScript],
    },
  },
  build: {
    formats: [BuildFormat.ESM, BuildFormat.UMD],
    platform: BuildPlatform.Node,
    target: BuildTarget.ESNext,
    tool: BuildTool.Vite,
  },
  test: {
    coverage: {
      reporters: [TestReporter.Lcov, TestReporter.JSONSummary],
    },
    tool: TestTool.Ava,
  },
  release: {
    publish: {
      access: PublishAccess.Public,
      license: License.MIT,
      registry: "https://registry.npmjs.org/",
    },
  },
  requirements: {
    node: ">=16",
    yarn: ">=3.2.0",
    packages: [
      BrowserPackage.JSFileDownload,
      UniversalPackage.SrcLaunchExceptions,
      UniversalPackage.EmailValidator,
      UniversalPackage.PasswordValidator,
      UniversalPackage.Zxcvbn,
    ],
    srclaunch: {
      dx: true,
      cli: true,
      types: true,
    },
  },
};
