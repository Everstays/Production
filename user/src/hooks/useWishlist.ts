import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setWishlistIds([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/wishlist/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const ids = await res.json();
        setWishlistIds(Array.isArray(ids) ? ids : []);
      } else {
        setWishlistIds([]);
      }
    } catch {
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (propertyId: string, isAdding: boolean) => {
      const token = localStorage.getItem('userToken');
      if (!token) return false;
      setLoading(true);
      try {
        const method = isAdding ? 'POST' : 'DELETE';
        const res = await fetch(`${API_BASE_URL}/users/wishlist/${propertyId}`, {
          method,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          if (isAdding) {
            setWishlistIds((prev) => (prev.includes(propertyId) ? prev : [...prev, propertyId]));
          } else {
            setWishlistIds((prev) => prev.filter((id) => id !== propertyId));
          }
          return true;
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
      return false;
    },
    [],
  );

  return { wishlistIds, toggleWishlist, fetchWishlist, loading };
}
