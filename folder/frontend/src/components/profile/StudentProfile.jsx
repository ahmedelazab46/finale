import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      profile_picture: '',
      current_password: '',
      new_password: '',
      confirm_password: ''
    },
    phone: '',
    profile_pic: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('لا يوجد رمز وصول');
      }

      const response = await axios.get(
        `${API_BASE_URL}/users/student/profile/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('بيانات الملف الشخصي:', response.data);

      setProfile({
        ...response.data,
        user: {
          ...response.data.user,
          profile_picture: response.data.user.profile_picture || DEFAULT_AVATAR,
          current_password: '',
          new_password: '',
          confirm_password: ''
        },
        profile_pic: response.data.profile_pic || DEFAULT_AVATAR
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات الملف الشخصي:', error);
      setError('فشل في تحميل بيانات الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('user.')) {
      const userField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [userField]: files ? files[0] : value
        }
      }));
    } else if (name === 'profile_pic') {
      setProfile(prev => ({
        ...prev,
        profile_pic: files[0]
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('لا يوجد رمز وصول');
      }

      const formData = new FormData();
      
      const userFields = ['first_name', 'last_name', 'profile_picture', 'current_password', 'new_password', 'confirm_password'];
      userFields.forEach(key => {
        if (profile.user[key] && profile.user[key] !== DEFAULT_AVATAR) {
          formData.append(`user.${key}`, profile.user[key]);
        }
      });

      const studentFields = ['phone', 'profile_pic'];
      studentFields.forEach(key => {
        if (profile[key] && profile[key] !== DEFAULT_AVATAR) {
          formData.append(key, profile[key]);
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/student/profile/update/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setSuccess('تم تحديث الملف الشخصي بنجاح');
      Swal.fire({
        title: 'نجاح!',
        text: 'تم تحديث الملف الشخصي بنجاح.' + (profile.user.new_password ? ' يرجى إعادة تسجيل الدخول.' : ''),
        icon: 'success',
        confirmButtonText: 'حسنًا'
      }).then(() => {
        if (profile.user.new_password) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      });

      await fetchProfile();
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      const errorMessage = error.response?.data || 'فشل في تحديث الملف الشخصي';
      console.log('تفاصيل الخطأ:', errorMessage);
      setError(errorMessage);
      Swal.fire('خطأ!', JSON.stringify(errorMessage), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div>جارٍ التحميل...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={
                  profile.profile_pic ? `${API_BASE_URL}${profile.profile_pic}` :
                  profile.user.profile_picture ? `${API_BASE_URL}${profile.user.profile_picture}` :
                  DEFAULT_AVATAR
                }
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h3>{profile.user.first_name} {profile.user.last_name}</h3>
              <p className="text-muted">طالب</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>معلومات الملف الشخصي</Card.Title>
              {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>الاسم الأول</Form.Label>
                      <Form.Control
                        type="text"
                        name="user.first_name"
                        value={profile.user.first_name || ''}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>الاسم الأخير</Form.Label>
                      <Form.Control
                        type="text"
                        name="user.last_name"
                        value={profile.user.last_name || ''}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    name="user.email"
                    value={profile.user.email || ''}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>رقم الهاتف</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>صورة الملف الشخصي</Form.Label>
                  <Form.Control
                    type="file"
                    name="profile_pic"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>كلمة المرور الحالية</Form.Label>
                  <Form.Control
                    type="password"
                    name="user.current_password"
                    value={profile.user.current_password || ''}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>كلمة المرور الجديدة</Form.Label>
                  <Form.Control
                    type="password"
                    name="user.new_password"
                    value={profile.user.new_password || ''}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                  <Form.Control
                    type="password"
                    name="user.confirm_password"
                    value={profile.user.confirm_password || ''}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;