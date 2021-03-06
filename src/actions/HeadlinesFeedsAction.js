import { dispatch } from "react-redux";

import * as types from '../constants/ActionTypes';

import { apiGet } from "../util/ApiUtil";


export const REQUEST_NEWS_RELOAD = "REQUEST_NEWS_RELOAD_HEADLINES";
export const RECEIVE_NEWS_RELOAD = "RECEIVE_NEWS_RELOAD_HEADLINES";

export const REQUEST_NEWS_LOAD_MORE = "REQUEST_NEWS_LOAD_MORE_HEADLINES";
export const RECEIVE_NEWS_LOAD_MORE = "RECEIVE_NEWS_LOAD_MORE_HEADLINES";


function requestNewsListReload() {
    return {
        type: REQUEST_NEWS_RELOAD
    }
}

function requestNewsListLoadMore() {
    return {
        type: REQUEST_NEWS_LOAD_MORE
    }
}

function receiveNewsListReload(list = [], statusCode, message) {
    return {
        type: RECEIVE_NEWS_RELOAD,
        list,
        statusCode,
        message
    }
}

function receiveNewsListLoadMore(page = 1, list = [], statusCode, message) {
    return {
        type: RECEIVE_NEWS_LOAD_MORE,
        page,
        list,
        statusCode,
        message
    }
}

export function loadNewsDetail(id) {
    return {
        type: types.SHOW_NEWS_DETAIL,
        id
    }
}

export function fetchNewsList(page) {
    if (!page || page == 0) {
        return dispatch => {
            // mark as refreshing
            dispatch(requestNewsListReload())

            return apiGet("/news/feed/similarity")
                .then(result => {
                    if (result.isSuccess) {
                        dispatch(receiveNewsListReload(result.data, result.statusCode, result.message));
                    } else {
                        // try 1 more time
                        apiGet("/news/feed/similarity").then(result2 => dispatch(receiveNewsListReload(result2.data, result2.statusCode, result2.message)));
                    }
                })
            };
        } else {
            return dispatch => {
                // mark as refreshing
                dispatch(requestNewsListLoadMore())
                return apiGet("/news/feed/similarity?page=" + (page + 1)).then(result => dispatch(receiveNewsListLoadMore(page + 1, result.data, result.statusCode, result.message)));
            }
        }
    }

