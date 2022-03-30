const moment = require("moment");

interface IResp {
  success: boolean;
  content: any;
  message: string;
  statusCode: number;
  dateTime: string;
}

export const ReS = (code: number, data: any, message?: string): object => {
  const resp: IResp = {
    success: true,
    content: data,
    message: message ? message : "Xử lý thành công!",
    statusCode: code,
    dateTime: moment().format(),
  };

  return { ...resp };
};

// hàm format kết quả trả về của API khi thất bại cho client
export const ReE = (code: number, err: any, message?: string): object => {
  console.log(err);
  const resp: IResp = {
    success: false,
    dateTime: moment().format(),
    statusCode: code,
    message: message ? message : "something error!",
    content: Array.isArray(err)
      ? err.map((e) => e.message)
      : typeof err === "object"
      ? err
      : err,
  };

  return { ...resp };
};
