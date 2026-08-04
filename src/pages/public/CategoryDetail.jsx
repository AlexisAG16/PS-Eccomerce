import { useState, useEffect } from 'react';

const CategoryDetail = ({ categoryName = "Electrónica" }) => {
  // Simulación de productos filtrados por esa categoría
  const [products, setProducts] = useState([
    { id: 1, name: 'Smartphone Pro', price: 799, img: 'https://via.placeholder.com' },
    { id: 2, name: 'Auriculares Bluetooth', price: 150, img: 'https://via.placeholder.com' },
    { id: 3, name: 'Cargador Carga Rápida', price: 25, img: 'https://via.placeholder.com' },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>
        Inicio / Categorías / <strong>{categoryName}</strong>
      </nav>
      
      <h1 style={{ marginBottom: '20px' }}>Productos de {categoryName}</h1>
      
      {/* Grid de productos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map((product) => (
          <div key={product.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px', 
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <img src={product.img} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
            <h3 style={{ fontSize: '1.1em', margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.2em' }}>
              ${product.price.toFixed(2)}
            </p>
            <button style={{ 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              padding: '10px 15px', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}>
              Ver producto
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && <p>No se encontraron productos en esta categoría.</p>}
    </div>
  );
};

export default CategoryDetail;
