function formatPaginatedResponse({ metadata, page = 1, limit = 10, total = 0 }) {
    return {
      data: metadata,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
module.exports = {
    formatPaginatedResponse,
};