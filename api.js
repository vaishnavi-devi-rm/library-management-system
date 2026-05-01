import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Books
export const getBooks = (search = '') => API.get(`/books?search=${search}`);
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Members
export const getMembers = (search = '') => API.get(`/members?search=${search}`);
export const createMember = (data) => API.post('/members', data);
export const updateMember = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember = (id) => API.delete(`/members/${id}`);

// Issues
export const getIssues = (status = '') => API.get(`/issues?status=${status}`);
export const issueBook = (data) => API.post('/issues', data);
export const returnBook = (id) => API.put(`/issues/${id}/return`);
export const getStats = () => API.get('/issues/stats/summary');
