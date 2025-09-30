import express from 'express'
import { login, logout, refereshAccessToken, register } from '../controllers/authController'

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/refresh-token',refereshAccessToken)
router.post('/logout',logout)

export default router