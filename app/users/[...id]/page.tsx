'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './userDetail.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    street: string;
    city: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function UserDetail() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`),
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${params.id}`)
        ]);

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error('خطا در دریافت اطلاعات');
        }

        const [userData, postsData] = await Promise.all([
          userResponse.json(),
          postsResponse.json()
        ]);

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError('خطا در دریافت اطلاعات کاربر');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUserData();
    }
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری اطلاعات کاربر...</div>;
  }

  if (error || !user) {
    return <div className={styles.error}>{error || 'کاربر یافت نشد'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <h1 className={styles.title}>{user.name}</h1>
        
        <div className={styles.userInfo}>
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>اطلاعات تماس</h2>
            <p className={styles.infoItem}>
              <span className={styles.label}>ایمیل:</span>
              <span className={styles.value} dir="ltr">{user.email}</span>
            </p>
            <p className={styles.infoItem}>
              <span className={styles.label}>تلفن:</span>
              <span className={styles.value} dir="ltr">{user.phone}</span>
            </p>
            <p className={styles.infoItem}>
              <span className={styles.label}>وبسایت:</span>
              <span className={styles.value} dir="ltr">{user.website}</span>
            </p>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>اطلاعات شرکت</h2>
            <p className={styles.infoItem}>
              <span className={styles.label}>نام شرکت:</span>
              <span className={styles.value}>{user.company.name}</span>
            </p>
            <p className={styles.infoItem}>
              <span className={styles.label}>شعار:</span>
              <span className={styles.value}>{user.company.catchPhrase}</span>
            </p>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>آدرس</h2>
            <p className={styles.infoItem}>
              <span className={styles.label}>شهر:</span>
              <span className={styles.value}>{user.address.city}</span>
            </p>
            <p className={styles.infoItem}>
              <span className={styles.label}>خیابان:</span>
              <span className={styles.value}>{user.address.street}</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>پست‌های کاربر</h2>
        <div className={styles.postsList}>
          {posts.map(post => (
            <div key={post.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postBody}>{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}