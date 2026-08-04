import React from 'react';

const OrderDetailsCard = ({ order }) => {
  // Simulamos datos si no viene la prop 'order'
  const data = order || {
    id: "#12345",
    date: "2024-05-20",
    status: "Enviado",
    items: [
      { name: "Producto A", qty: 2, price: 50 },
      { name: "Producto B", qty: 1, price: 100 }
    ],
    total: 200,
    shippingAddress: "Calle Falsa 123, Ciudad"
  };

  return (
    <div style={styles.card}>
      <header style={styles.header}>
        <h3>Detalles del Pedido: {data.id}</h3>
        <span style={styles.statusTag}>{data.status}</span>
      </header>

      <div style={styles.body}>
        <p><strong>Fecha:</strong> {data.date}</p>
        <p><strong>Envío a:</strong> {data.shippingAddress}</p>
        
        <hr />
        
        <h4>Productos</h4>
        <ul style={styles.list}>
          {data.items.map((item, index) => (
            <li key={index} style={styles.item}>
              <span>{item.name} (x{item.qty})</span>
              <span>${item.price * item.qty}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer style={styles.footer}>
        <h4>Total: ${data.total}</h4>
      </footer >
    </div>
  );
};

const styles = {
  card: { border: '1px solid #ddd', borderRadius: '10px', padding: '20px', maxWidth: '400px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  statusTag: { backgroundColor: '#e0f7fa', color: '#006064', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
  body: { fontSize: '14px', color: '#555' },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
  footer: { marginTop: '15px', borderTop: '2px solid #eee', paddingTop: '10px', textAlign: 'right' }
};

export default OrderDetailsCard;
