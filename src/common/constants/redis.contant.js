
const REDIS_KEY = {
    // auth
    REFRESHTOKEN: 'refreshToken:{{{userId}}}',
    REFRESHTOKEN_EX: 60 * 60 * 24 * 7,
    
    getRefreshToken: (userId) => {
        return REDIS_KEY.REFRESHTOKEN.replace('{{{userId}}}', userId)
    },

    // user
    USER_DETAIL: 'user:{{{userId}}}',
    USER_DETAIL_EX: 300, 
    getUserDetail: (userId) => {
        return REDIS_KEY.USER_DETAIL.replace('{{{userId}}}', userId);
    },

    USER_LIST: 'users:page={{{page}}}&limit={{{limit}}}&role={{{role}}}&query={{{query}}}',
    USER_LIST_EX: 60,
    getUserList: (page, limit, role, query) => {
        return REDIS_KEY.USER_LIST.replace('{{{page}}}', page)
            .replace('{{{limit}}}', limit)
            .replace('{{{role}}}', role)
            .replace('{{{query}}}', query);
    },

    //instructor request
    INSTRUCTOR_REQUEST_DETAIL: "instructor_request:{{id}}",
    INSTRUCTOR_REQUEST_MY: "instructor_request:user:{{userId}}",
    INSTRUCTOR_REQUEST_LIST: "instructor_requests:list:page={{{page}}}&limit={{{limit}}}&status={{{status}}}&query={{{query}}}",
    INSTRUCTOR_REQUEST_DETAIL_EX: 60*5,      
    INSTRUCTOR_REQUEST_MY_EX: 60*3,           
    INSTRUCTOR_REQUEST_LIST_EX: 60*2,

    getRequestDetailKey: (id) => `instructor_request:${id}`,
    getRequestMyKey: (userId) => `instructor_request:user:${userId}`,
    getRequestListKey: (page, limit, status, query) => {
        return REDIS_KEY.INSTRUCTOR_REQUEST_LIST.replace('{{{page}}}', page)
            .replace('{{{limit}}}', limit)
            .replace('{{{status}}}', status)
            .replace('{{{query}}}', query);
    },


    //course
    PUBLIC_COURSE_LIST: ({page, limit, query}) =>  `course:public:list?page=${page}&limit=${limit}&query=${query}`,
    PUBLIC_COURSE_LIST_EX: 60 * 10,

    getCourseDetailBySlug: (slug) => `course:detail:slug:${slug}`,
    CourseDetailBySlug_EX: 60 * 10,

    getCoursesByCategorySlug: (slug) => `courses:category:${slug}`,
    PUBLIC_COURSE_LIST_EX: 60 * 10, 
}

module.exports = REDIS_KEY