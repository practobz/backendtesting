import { parse } from 'url';
import { adminSignup, login } from '../controllers/adminController.js';

export default async function adminRoutes(req, res) {
  const { pathname } = parse(req.url, true);
  console.log(`➡️ Method: ${req.method}, Pathname: ${pathname}`);

  if (req.method === 'POST' && pathname === '/signup/admin') {
    console.log('✅ Matched admin signup');
    return await adminSignup(req, res);
  }

  if (req.method === 'POST' && pathname === '/login') {
    return await login(req, res);
  }

  return false;
}
