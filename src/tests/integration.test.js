import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
let authCookie = '';
let testFileId = '';

describe('File Sharing Application Integration Tests', () => {
  // Authentication Tests
  describe('Authentication', () => {
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'Test123!@#'
    };

    test('Should register a new user', async () => {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      expect(response.status).toBe(201);
      authCookie = response.headers['set-cookie'][0];
    });

    test('Should login with registered user', async () => {
      const response = await axios.post(`${API_URL}/auth/login`, testUser);
      expect(response.status).toBe(200);
      authCookie = response.headers['set-cookie'][0];
    });

    test('Should verify authentication token', async () => {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Cookie: authCookie }
      });
      expect(response.status).toBe(200);
    });
  });

  // File Upload and Management Tests
  describe('File Management', () => {
    test('Should upload an image file', async () => {
      const formData = new FormData();
      const testImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', testImage);

      const response = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Cookie: authCookie
        }
      });
      expect(response.status).toBe(201);
      testFileId = response.data.id;
    });

    test('Should list uploaded files', async () => {
      const response = await axios.get(`${API_URL}/files`, {
        headers: { Cookie: authCookie }
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('Should update file tags', async () => {
      const tags = ['test', 'image'];
      const response = await axios.put(
        `${API_URL}/files/${testFileId}/tags`,
        { tags },
        { headers: { Cookie: authCookie } }
      );
      expect(response.status).toBe(200);
      expect(response.data.tags).toEqual(tags);
    });

    test('Should reorder files', async () => {
      const response = await axios.put(
        `${API_URL}/files/${testFileId}/reorder`,
        { newPosition: 0 },
        { headers: { Cookie: authCookie } }
      );
      expect(response.status).toBe(200);
      expect(response.data.position).toBe(0);
    });
  });

  // File Sharing Tests
  describe('File Sharing', () => {
    test('Should access shared file without authentication', async () => {
      const response = await axios.get(`${API_URL}/files/shared/${testFileId}`);
      expect(response.status).toBe(200);
    });

    test('Should record file view', async () => {
      const response = await axios.post(`${API_URL}/files/${testFileId}/view`);
      expect(response.status).toBe(200);
    });

    test('Should get file statistics', async () => {
      const response = await axios.get(`${API_URL}/files/${testFileId}/stats`, {
        headers: { Cookie: authCookie }
      });
      expect(response.status).toBe(200);
      expect(response.data.views).toBeGreaterThan(0);
    });
  });

  // Cleanup Tests
  describe('Cleanup', () => {
    test('Should delete uploaded file', async () => {
      const response = await axios.delete(`${API_URL}/files/${testFileId}`, {
        headers: { Cookie: authCookie }
      });
      expect(response.status).toBe(200);
    });

    test('Should logout user', async () => {
      const response = await axios.post(`${API_URL}/auth/logout`, null, {
        headers: { Cookie: authCookie }
      });
      expect(response.status).toBe(200);
    });
  });
}); 