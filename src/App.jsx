import { useMemo, useState } from 'react';
import {
  Box,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Menu,
  PackageOpen,
  PauseCircle,
  Search,
  SlidersHorizontal,
  User,
  ClipboardList,
} from 'lucide-react';

const statusConfig = {
  Completado: {
    label: 'Completado',
    pillClass: 'status-completed',
    actionClass: 'action-completed',
    icon: Check,
  },
  'En preparacion': {
    label: 'En preparación',
    pillClass: 'status-preparing',
    actionClass: 'action-preparing',
    icon: Box,
  },
  Pendiente: {
    label: 'Pendiente',
    pillClass: 'status-pending',
    actionClass: 'action-pending',
    icon: PauseCircle,
  },
  Retrasado: {
    label: 'Retrasado',
    pillClass: 'status-delayed',
    actionClass: 'action-delayed',
    icon: Clock3,
  },
};

const remitosBase = [
  {
    id: 'RMT-000125',
    client: 'Distribuidora del Norte',
    date: '24/05/2025 08:15',
    status: 'Completado',
    address: 'Ruta 9 Km 721, Córdoba, Córdoba',
    notes: 'Pedido recibido completo por depósito central.',
    products: [
      { name: 'Harina 000 1kg', quantity: 18 },
      { name: 'Aceite girasol 900ml', quantity: 24 },
      { name: 'Arroz largo fino 1kg', quantity: 12 },
    ],
  },
  {
    id: 'RMT-000126',
    client: 'Supermercado Central',
    date: '24/05/2025 09:30',
    status: 'En preparacion',
    address: 'Bv. Chacabuco 814, Córdoba, Córdoba',
    notes: 'Separar mercadería refrigerada al final de la carga.',
    products: [
      { name: 'Leche entera 1L', quantity: 36 },
      { name: 'Galletitas surtidas', quantity: 20 },
      { name: 'Café molido 500g', quantity: 8 },
    ],
  },
  {
    id: 'RMT-000127',
    client: 'Almacén San Martín',
    date: '24/05/2025 10:45',
    status: 'Pendiente',
    address: 'Av. San Martín 2450, Córdoba, Córdoba',
    notes: 'Entregar en horario comercial. Llamar antes de entregar.',
    products: [
      { name: 'Yerba Mate 1kg', quantity: 10 },
      { name: 'Azúcar 1kg', quantity: 20 },
      { name: 'Fideos Tallarín 500g', quantity: 15 },
    ],
  },
  {
    id: 'RMT-000128',
    client: 'Mayorista Express',
    date: '24/05/2025 11:20',
    status: 'Retrasado',
    address: 'Av. Circunvalación 3350, Córdoba, Córdoba',
    notes: 'Cliente solicitó prioridad por cierre de recepción a las 13:00.',
    products: [
      { name: 'Tomate triturado 520g', quantity: 48 },
      { name: 'Mayonesa 475g', quantity: 16 },
      { name: 'Sal fina 500g', quantity: 30 },
    ],
  },
  {
    id: 'RMT-000129',
    client: 'Kiosco 24 Horas',
    date: '24/05/2025 12:10',
    status: 'Pendiente',
    address: 'La Rioja 1055, Córdoba, Córdoba',
    notes: 'Dejar la mercadería con encargado de turno.',
    products: [
      { name: 'Agua mineral 500ml', quantity: 24 },
      { name: 'Alfajor chocolate', quantity: 60 },
      { name: 'Papas fritas 45g', quantity: 30 },
    ],
  },
];

function App() {
  const [remitos, setRemitos] = useState(remitosBase);
  const [selectedId, setSelectedId] = useState('RMT-000127');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('Todos');

  const statusOptions = ['Todos', ...Object.keys(statusConfig)];

  const filteredRemitos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return remitos.filter((remito) => {
      const matchesQuery =
        !normalizedQuery ||
        remito.id.toLowerCase().includes(normalizedQuery) ||
        remito.client.toLowerCase().includes(normalizedQuery);
      const matchesStatus = activeStatus === 'Todos' || remito.status === activeStatus;
      return matchesQuery && matchesStatus;
    });
  }, [activeStatus, query, remitos]);

  const selectedRemito =
    remitos.find((remito) => remito.id === selectedId) ?? filteredRemitos[0] ?? remitos[0];

  const updateSelectedStatus = (status) => {
    setRemitos((current) =>
      current.map((remito) => (remito.id === selectedRemito.id ? { ...remito, status } : remito)),
    );
  };

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="Visualizador de remitos">
        <header className="topbar">
          <button className="icon-button" type="button" aria-label="Abrir menú">
            <Menu size={30} strokeWidth={2.4} />
          </button>
          <h1>Remitos</h1>
          <span className="topbar-spacer" />
        </header>

        <section className="tools-row" aria-label="Herramientas de búsqueda">
          <label className="search-box">
            <Search size={28} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar remito o cliente..."
            />
          </label>
          <button
            className={`filter-button ${filterOpen ? 'filter-button-active' : ''}`}
            type="button"
            onClick={() => setFilterOpen((current) => !current)}
          >
            <SlidersHorizontal size={24} />
            <span>Filtros</span>
          </button>
        </section>

        {filterOpen && (
          <section className="filter-panel" aria-label="Filtrar por estado">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={activeStatus === status ? 'chip chip-active' : 'chip'}
                type="button"
                onClick={() => setActiveStatus(status)}
              >
                {statusConfig[status]?.label ?? status}
              </button>
            ))}
          </section>
        )}

        <section className="remitos-table" aria-label="Listado de remitos">
          <div className="table-head">
            <span>N° Remito</span>
            <span>Cliente</span>
            <span>Fecha / Hora</span>
            <span>Estado</span>
            <span />
          </div>

          {filteredRemitos.map((remito) => {
            const status = statusConfig[remito.status];
            return (
              <button
                key={remito.id}
                className={`remito-row ${remito.id === selectedRemito.id ? 'remito-row-active' : ''}`}
                type="button"
                onClick={() => setSelectedId(remito.id)}
              >
                <strong>{remito.id}</strong>
                <span>{remito.client}</span>
                <span>{remito.date}</span>
                <span className={`status-pill ${status.pillClass}`}>{status.label}</span>
                <ChevronRight className="row-chevron" size={28} />
              </button>
            );
          })}
        </section>

        <section className="detail-card" aria-label={`Detalle de ${selectedRemito.id}`}>
          <div className="detail-heading">
            <div className="document-icon">
              <FileText size={30} />
            </div>
            <h2>{selectedRemito.id}</h2>
            <StatusPill status={selectedRemito.status} />
          </div>

          <div className="detail-info">
            <InfoLine icon={User} label="Cliente" value={selectedRemito.client} strong />
            <InfoLine icon={MapPin} label="Dirección" value={selectedRemito.address} />
            <InfoLine icon={ClipboardList} label="Observaciones" value={selectedRemito.notes} />
          </div>

          <div className="products-title">
            <PackageOpen size={31} />
            <h3>Productos</h3>
          </div>

          <div className="products-table">
            <div className="products-head">
              <span>Producto</span>
              <span>Cantidad</span>
            </div>
            {selectedRemito.products.map((product) => (
              <div className="product-row" key={product.name}>
                <span>{product.name}</span>
                <span>{product.quantity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="status-actions" aria-label="Cambiar estado del remito">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={status}
                className={`status-action ${config.actionClass}`}
                type="button"
                onClick={() => updateSelectedStatus(status)}
              >
                <Icon size={34} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </section>
      </section>
    </main>
  );
}

function StatusPill({ status }) {
  const config = statusConfig[status];
  return <span className={`status-pill ${config.pillClass}`}>{config.label}</span>;
}

function InfoLine({ icon: Icon, label, value, strong = false }) {
  return (
    <div className="info-line">
      <Icon className="info-icon" size={31} />
      <div>
        <span>{label}</span>
        <p className={strong ? 'info-strong' : undefined}>{value}</p>
      </div>
    </div>
  );
}

export default App;
