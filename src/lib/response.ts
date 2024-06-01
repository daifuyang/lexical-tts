const json = {
  code: 1,
  msg: "",
  data: null
};

function success(msg: string, data: any = null) {
  json.code = 1;
  json.msg = msg;
  json.data = data;
  return Response.json(json);
}

function error(msg: string, data: any = null) {
  json.code = 0;
  json.msg = msg;
  json.data = data;
  return Response.json(json);
}

function errorWithCode(code: number,msg: string, data: any = null) {
  json.code = code;
  json.msg = msg;
  json.data = data;
  return Response.json(json);
}

export type Pagination<T> = {
  total: number;
  data: T[];
  current: number;
  pageSize: number;
};

export default {
  success,
  error,
  errorWithCode,
};
