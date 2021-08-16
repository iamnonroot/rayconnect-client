import { IQueryRequest, IQueryResponse } from "./query";

export interface BackQuery {
    request: IQueryRequest<any>
    response: IQueryResponse
}

export interface BaseQuery {
    scope: string
    method: string
    address: string
}

export interface OnQuery extends BaseQuery { }

export interface OnQueryCallback {
    (request: IQueryRequest<any>, response: IQueryResponse): void;
}

export interface SendQuery<T> extends BaseQuery {
    data: T | any
    user?: string
    token?: string
}

export interface ExecQuery<T> extends SendQuery<T> { }

export interface ExecQueryResponse<T> extends IQueryRequest<T> { }