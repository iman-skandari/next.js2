'use client'

import React, { useEffect, useState } from 'react';
import styles from './posts.module.css';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('خطا در دریافت پست‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری پست‌ها...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>لیست پست‌ها</h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postBody}>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}