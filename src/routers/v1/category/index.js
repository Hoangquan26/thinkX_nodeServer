const express = require('express');
const router = express.Router();

const asyncHandle = require('../../../helpers/asyncHandle');
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser');

const UserRole = require('../../../common/constants/userRole');
const CategoryController = require('../../../controllers/category.controller');

/**
 * @route   GET /v1/categories
 * @desc    Public API - Get all categories (for dropdown/filter/search etc.)
 */
router.get('/public', asyncHandle(CategoryController.getAllCategoriesPublic));

/**
 * @route   GET /v1/categories/:slug
 * @desc    Public API - Get category by slug with its basic info
 */
router.get('/:slug', asyncHandle(CategoryController.getCategoryBySlug));

router.use('', authUserMiddleware);
router.use('/admin',authRoleMiddleware([UserRole.ADMIN]));

/**
 * @route   GET /v1/admin/categories
 * @desc    Get paginated categories (admin) with filters, search
 */
router.get('/admin/all', asyncHandle(CategoryController.getCategoriesWithPagination));

/**
 * @route   GET /v1/admin/categories/:id
 * @desc    Get detail of a specific category by ID
 */
router.get('/admin/:id', asyncHandle(CategoryController.getCategoryDetail));

/**
 * @route   POST /v1/admin/categories
 * @desc    Create a new category
 */
router.post('/admin', asyncHandle(CategoryController.create));

/**
 * @route   PATCH /v1/admin/categories/:id
 * @desc    Update an existing category
 */
router.patch('/admin/:id', asyncHandle(CategoryController.updateCategory));

/**
 * @route   DELETE /v1/admin/categories/:id
 * @desc    Soft delete a category
 */
// router.delete('/:id', asyncHandle(CategoryController.softDeleteCategory));

// /**
//  * @route   PATCH /v1/admin/categories/:id/restore
//  * @desc    Restore a soft-deleted category
//  */
// router.patch('/:id/restore', asyncHandle(CategoryController.restoreCategory));

module.exports = router;
