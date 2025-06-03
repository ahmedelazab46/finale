import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera } from 'react-icons/fa';
import '../../styles/StudentProfile.css';

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
      <div className="student-profile">
        <Container>
          <div className="loading-spinner">جارٍ التحميل...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="student-profile">
      <Container>
        <div className="profile-header">
          <h2>الملف الشخصي</h2>
          <p className="text-light opacity-75">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>

        <Row>
          <Col md={4}>
            <div className="profile-card">
              <div className="profile-info">
                {profile.profile_pic ? (
                  <img
                    src={
                      profile.profile_pic instanceof File
                        ? URL.createObjectURL(profile.profile_pic)
                        : `${API_BASE_URL}${profile.profile_pic}`
                    }
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <FaUser size={50} />
                  </div>
                )}
                <h3 className="profile-name">{`${profile.user.first_name} ${profile.user.last_name}`}</h3>
                <p className="profile-title">طالب</p>
              </div>
            </div>
          </Col>

          <Col md={8}>
            <div className="profile-card">
              <div className="profile-info">
                <h4 className="section-title mb-4">المعلومات الشخصية</h4>
                
                {error && <Alert variant="danger" className="alert">{error}</Alert>}
                {success && <Alert variant="success" className="alert">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label className="form-label">الاسم الأول</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                          <Form.Control
                            type="text"
                            name="user.first_name"
                            value={profile.user.first_name || ''}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label className="form-label">الاسم الأخير</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                          <Form.Control
                            type="text"
                            name="user.last_name"
                            value={profile.user.last_name || ''}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="form-group">
                    <Form.Label className="form-label">البريد الإلكتروني</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        name="user.email"
                        value={profile.user.email || ''}
                        disabled
                        className="form-control"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="form-label">رقم الهاتف</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaPhone />
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="form-label">صورة الملف الشخصي</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaCamera />
                      </span>
                      <Form.Control
                        type="file"
                        name="profile_pic"
                        onChange={handleChange}
                        accept="image/*"
                        className="form-control"
                      />
                    </div>
                  </Form.Group>

                  <div className="password-section mt-4">
                    <h5 className="section-title mb-3">تغيير كلمة المرور</h5>
                    
                    <Form.Group className="form-group">
                      <Form.Label className="form-label">كلمة المرور الحالية</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          name="user.current_password"
                          value={profile.user.current_password || ''}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label className="form-label">كلمة المرور الجديدة</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          name="user.new_password"
                          value={profile.user.new_password || ''}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label className="form-label">تأكيد كلمة المرور الجديدة</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          name="user.confirm_password"
                          value={profile.user.confirm_password || ''}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <Button 
                    type="submit" 
                    className="action-button mt-4"
                    disabled={loading}
                  >
                    {loading ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentProfile;