// app/globals.d.ts
declare module '*.css' {
  const content: any;
  export default content;
}

declare module "mammoth/mammoth.browser" {
  const mammoth: {
    convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>;
  };
  export default mammoth;
}
