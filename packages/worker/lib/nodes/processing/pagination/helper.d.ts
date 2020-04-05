import { PaginationTypes, NextLinkPagination, LinkListPagination } from './typedefs';
export declare const getFullUrl: (url: string, rootUrl: string) => string;
export declare const isNextLinkPagination: (pagination: PaginationTypes) => pagination is NextLinkPagination;
export declare const isLinkListPagination: (pagination: PaginationTypes) => pagination is LinkListPagination;
