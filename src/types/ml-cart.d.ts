declare module 'ml-cart' {
  export class DecisionTreeClassifier {
    constructor(options?: {
      gainFunction?: 'gini' | 'entropy';
      maxDepth?: number;
      minNumSamples?: number;
    });

    train(trainingSet: number[][], labels: number[]): void;
    predict(rows: number[][]): number[];
    toJSON?(): unknown;
    root?: unknown;

    static load(json: unknown): {
      predict(rows: number[][]): number[];
      root?: unknown;
    };
  }
}
