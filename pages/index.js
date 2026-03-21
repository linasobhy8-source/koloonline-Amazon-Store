import { useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#232f3e', color: '#fff', padding: '15px 20px', textAlign: 'center' }}>
        <h1>Koloonline Amazon Store</h1>
      </header>
      
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
          placeholder="Search for products..."
          style={{ 
            padding: '10px', 
            width: '60%', 
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={searchProducts}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            background: '#ff9900',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        padding: '20px'
      }}>
        {products.map((product, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '15px',
              textAlign: 'center'
            }}
          >
            {product.thumbnail && (
              <img 
                src={product.thumbnail} 
                alt={product.title}
                style={{ width: '100%', height: '200px', objectFit: 'contain' }}
              />
            )}
            <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{product.title}</h3>
            <p style={{ color: '#b12704', fontWeight: 'bold' }}>{product.price}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          Search for products to get started
        </p>
      )}
    </div>
  );
}
