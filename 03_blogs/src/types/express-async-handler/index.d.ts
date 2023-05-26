// express-async-handler.d.ts
declare module "express-async-handler" {
  import { Request, Response, NextFunction } from "express";

  type AsyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

  const asyncHandler: AsyncHandler;

  export = asyncHandler;
}
