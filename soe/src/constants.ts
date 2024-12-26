/**
 * 日志类型
 * */ 
export const LOG_TYPE_MAP = {
    SOCKET_ERROR: 'socket_error',
    SOCKET_CLOSE: 'socket_close',
    SOCKET_OPEN: 'socket_open',
    SOCKET_MESSAGE: 'socket_message',
    SOCKET_SEND: 'socket_send',
    SOCKET_RECONNECT: 'socket_reconnect',
    RECORD_ERROR: 'record_error',
    RECORD_STOP: 'record_stop',
    RECOGNIZER_START: 'recognizer_start',
    RECOGNIZER_END: 'recognizer_end',
    RECOGNIZER_ONE_SENTENCE_BEGIN: 'recognizer_one_sentence_begin',
    RECOGNIZER_RESULT_CHANGE: 'recognizer_result_change',
    RECOGNIZER_ONE_SENTENCE_END: 'recognizer_one_sentence_end',
    RECOGNIZER_COMPLETE: 'recognizer_complete',
    RECOGNIZER_ERROR: 'recognizer_error',
    RECORD_DATA: 'record_data',
    SDK_INIT_ERROR: 'sdk_init_error'
}