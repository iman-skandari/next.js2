'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './userList.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, postsResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        if (!usersResponse.ok || !postsResponse.ok) {
          throw new Error('خطا در دریافت اطلاعات');
        }

        const [usersData, postsData] = await Promise.all([
          usersResponse.json(),
          postsResponse.json()
        ]);

        setUsers(usersData);
        setPosts(postsData);
      } catch (err) {
        setError('خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>لیست کاربران و پست‌ها</h1>
      <div className={styles.grid}>
        {users.map((user) => {
          const userPosts = posts.filter(post => post.userId === user.id);
          
          return (
            <div key={user.id} className={styles.card}>
              <Link href={`/users/${user.id}`} className={styles.cardLink}>
                <h2 className={styles.cardTitle}>{user.name}</h2>
              </Link>
              <div className={styles.cardContent}>
                <p style={{direction:"ltr"}} className={styles.infoItem}>
                  <span className={styles.value}>{user.email}</span>
                  <span className={styles.label}>:ایمیل</span>
                </p>
                <p style={{direction:"ltr"}} className={styles.infoItem}>
                  <span className={styles.value}>{user.phone}</span>
                  <span className={styles.label}>:تلفن</span>
                </p>
                <p style={{direction:"ltr"}} className={styles.infoItem}>
                  <span className={styles.value}>{user.website}</span>
                  <span className={styles.label}>:وبسایت</span>
                </p>
                
                <div className={styles.postsSection}>
                  <h3 className={styles.postsTitle}>پست‌های کاربر</h3>
                  <div className={styles.postsList}>
                    {userPosts.slice(0, 2).map(post => (
                      <div key={post.id} className={styles.postItem}>
                        <h4 className={styles.postTitle}>{post.title}</h4>
                        <p className={styles.postBody}>{post.body.substring(0, 100)}...</p>
                      </div>
                    ))}
                    {userPosts.length > 2 && (
                      <Link href={`/users/${user.id}`} className={styles.viewMore}>
                        مشاهده همه پست‌ها
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;