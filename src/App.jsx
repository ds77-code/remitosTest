import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Box,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  ListChecks,
  MapPin,
  Monitor,
  PackageOpen,
  PauseCircle,
  Play,
  Search,
  SlidersHorizontal,
  TabletSmartphone,
  Truck,
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
    label: 'En preparacion',
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

const priorityConfig = {
  Alta: { label: 'Alta', className: 'priority-high', value: 3 },
  Media: { label: 'Media', className: 'priority-medium', value: 2 },
  Baja: { label: 'Baja', className: 'priority-low', value: 1 },
};

const teams = ['1', '2', '3', '4'];

const remitosBase = [
  {
    id: 'RMT-000125',
    client: 'Distribuidora del Norte',
    date: '03/06/2026 08:15',
    time: '08:15',
    priority: 'Media',
    status: 'Completado',
    assignedTeam: '2',
    zone: 'Norte',
    address: 'Ruta 9 Km 721, Cordoba',
    notes: 'Pedido recibido completo por deposito central.',
    products: [
      { name: 'Harina 000 1kg', quantity: 18 },
      { name: 'Aceite girasol 900ml', quantity: 24 },
      { name: 'Arroz largo fino 1kg', quantity: 12 },
    ],
  },
  {
    id: 'RMT-000126',
    client: 'Supermercado Central',
    date: '03/06/2026 09:30',
    time: '09:30',
    priority: 'Alta',
    status: 'En preparacion',
    assignedTeam: '3',
    zone: 'Centro',
    address: 'Bv. Chacabuco 814, Cordoba',
    notes: 'Separar mercaderia refrigerada al final de la carga.',
    products: [
      { name: 'Leche entera 1L', quantity: 36 },
      { name: 'Galletitas surtidas', quantity: 20 },
      { name: 'Cafe molido 500g', quantity: 8 },
    ],
  },
  {
    id: 'RMT-000127',
    client: 'Almacen San Martin',
    date: '03/06/2026 10:45',
    time: '10:45',
    priority: 'Alta',
    status: 'Pendiente',
    assignedTeam: null,
    zone: 'Centro',
    address: 'Av. San Martin 2450, Cordoba',
    notes: 'Entregar en horario comercial. Llamar antes de entregar.',
    products: [
      { name: 'Yerba Mate 1kg', quantity: 10 },
      { name: 'Azucar 1kg', quantity: 20 },
      { name: 'Fideos Tallarin 500g', quantity: 15 },
    ],
  },
  {
    id: 'RMT-000128',
    client: 'Mayorista Express',
    date: '03/06/2026 11:20',
    time: '11:20',
    priority: 'Alta',
    status: 'Retrasado',
    assignedTeam: '1',
    zone: 'Sur',
    address: 'Av. Circunvalacion 3350, Cordoba',
    notes: 'Cliente solicito prioridad por cierre de recepcion a las 13:00.',
    products: [
      { name: 'Tomate triturado 520g', quantity: 48 },
      { name: 'Mayonesa 475g', quantity: 16 },
      { name: 'Sal fina 500g', quantity: 30 },
    ],
  },
  {
    id: 'RMT-000129',
    client: 'Kiosco 24 Horas',
    date: '03/06/2026 12:10',
    time: '12:10',
    priority: 'Baja',
    status: 'Pendiente',
    assignedTeam: null,
    zone: 'Nueva Cordoba',
    address: 'La Rioja 1055, Cordoba',
    notes: 'Dejar la mercaderia con encargado de turno.',
    products: [
      { name: 'Agua mineral 500ml', quantity: 24 },
      { name: 'Alfajor chocolate', quantity: 60 },
      { name: 'Papas fritas 45g', quantity: 30 },
    ],
  },
  {
    id: 'RMT-000130',
    client: 'Autoservicio Patagonia',
    date: '03/06/2026 13:00',
    time: '13:00',
    priority: 'Media',
    status: 'Pendiente',
    assignedTeam: null,
    zone: 'Oeste',
    address: 'Santa Ana 4020, Cordoba',
    notes: 'Descarga por porton lateral.',
    products: [
      { name: 'Detergente 750ml', quantity: 18 },
      { name: 'Lavandina 1L', quantity: 20 },
      { name: 'Rollo cocina', quantity: 14 },
    ],
  },
  {
    id: 'RMT-000131',
    client: 'Mercado Los Aromos',
    date: '03/06/2026 14:15',
    time: '14:15',
    priority: 'Media',
    status: 'En preparacion',
    assignedTeam: '4',
    zone: 'Este',
    address: 'Av. Sabattini 1880, Cordoba',
    notes: 'Verificar cajas cerradas antes de salir.',
    products: [
      { name: 'Pure de tomate 520g', quantity: 30 },
      { name: 'Fideos guiseros 500g', quantity: 25 },
      { name: 'Arvejas lata', quantity: 18 },
    ],
  },
];

const statusSort = {
  Retrasado: 0,
  Pendiente: 1,
  'En preparacion': 2,
  Completado: 3,
};

function App() {
  const [remitos, setRemitos] = useState(remitosBase);
  const [selectedId, setSelectedId] = useState('RMT-000127');
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') === 'monitor' ? 'monitor' : 'equipo';
  const teamId = params.get('equipo') || '1';

  const sortedTodayRemitos = useMemo(() => sortRemitos(remitos), [remitos]);
  const selectedRemito =
    remitos.find((remito) => remito.id === selectedId) ?? sortedTodayRemitos[0] ?? remitos[0];

  const updateRemito = (id, patch) => {
    setRemitos((current) =>
      current.map((remito) => (remito.id === id ? { ...remito, ...patch } : remito)),
    );
  };

  const selectRemito = (id) => {
    setSelectedId(id);
  };

  return view === 'monitor' ? (
    <MonitorView remitos={sortedTodayRemitos} />
  ) : (
    <TeamView
      remitos={remitos}
      selectedRemito={selectedRemito}
      teamId={teamId}
      onSelect={selectRemito}
      onUpdate={updateRemito}
    />
  );
}

function MonitorView({ remitos }) {
  const pendingCount = remitos.filter((remito) => remito.status !== 'Completado').length;
  const takenCount = remitos.filter((remito) => remito.assignedTeam).length;

  return (
    <main className="monitor-shell">
      <header className="monitor-header">
        <div>
          <span className="screen-kicker">Monitor general</span>
          <h1>Remitos del dia</h1>
        </div>
        <div className="monitor-summary" aria-label="Resumen operativo">
          <Metric label="Pendientes" value={pendingCount} />
          <Metric label="Tomados" value={takenCount} />
          <Metric label="Total" value={remitos.length} />
        </div>
      </header>

      <section className="monitor-board" aria-label="Remitos ordenados por prioridad">
        <div className="monitor-row monitor-row-head">
          <span>Prioridad</span>
          <span>Remito</span>
          <span>Cliente</span>
          <span>Zona</span>
          <span>Hora</span>
          <span>Estado</span>
          <span>Equipo</span>
        </div>

        {remitos.map((remito) => (
          <div className={`monitor-row ${remito.status === 'Retrasado' ? 'monitor-row-alert' : ''}`} key={remito.id}>
            <PriorityPill priority={remito.priority} />
            <strong>{remito.id}</strong>
            <span>{remito.client}</span>
            <span>{remito.zone}</span>
            <span>{remito.time}</span>
            <StatusPill status={remito.status} />
            <TeamBadge team={remito.assignedTeam} />
          </div>
        ))}
      </section>

      <footer className="view-links">
        <a href="?view=equipo&equipo=1">
          <TabletSmartphone size={22} />
          Equipo 1
        </a>
        <a href="?view=equipo&equipo=2">
          <TabletSmartphone size={22} />
          Equipo 2
        </a>
      </footer>
    </main>
  );
}

function TeamView({ remitos, selectedRemito, teamId, onSelect, onUpdate }) {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('Todos');

  const availableRemitos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortRemitos(remitos).filter((remito) => {
      const isVisibleForTeam = !remito.assignedTeam || remito.assignedTeam === teamId;
      const matchesQuery =
        !normalizedQuery ||
        remito.id.toLowerCase().includes(normalizedQuery) ||
        remito.client.toLowerCase().includes(normalizedQuery) ||
        remito.zone.toLowerCase().includes(normalizedQuery);
      const matchesStatus = activeStatus === 'Todos' || remito.status === activeStatus;
      return isVisibleForTeam && matchesQuery && matchesStatus;
    });
  }, [activeStatus, query, remitos, teamId]);

  const canTake = !selectedRemito.assignedTeam;
  const isMine = selectedRemito.assignedTeam === teamId;

  const takeRemito = () => {
    if (!canTake) return;
    onUpdate(selectedRemito.id, { assignedTeam: teamId, status: 'En preparacion' });
  };

  const releaseRemito = () => {
    if (!isMine) return;
    onUpdate(selectedRemito.id, { assignedTeam: null, status: 'Pendiente' });
  };

  const updateSelectedStatus = (status) => {
    if (!isMine && selectedRemito.assignedTeam) return;
    onUpdate(selectedRemito.id, {
      status,
      assignedTeam: status === 'Completado' ? teamId : selectedRemito.assignedTeam || teamId,
    });
  };

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label={`Vista del equipo ${teamId}`}>
        <header className="topbar team-topbar">
          <div className="team-mark">
            <Truck size={26} />
            <span>Equipo {teamId}</span>
          </div>
          <h1>Remitos</h1>
          <a className="icon-link" href="?view=monitor" aria-label="Abrir monitor">
            <Monitor size={28} />
          </a>
        </header>

        <section className="tools-row" aria-label="Herramientas de busqueda">
          <label className="search-box">
            <Search size={28} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar remito, cliente o zona..."
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
            {['Todos', ...Object.keys(statusConfig)].map((status) => (
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

        <section className="remitos-table" aria-label="Listado de remitos para tomar">
          <div className="table-head team-table-head">
            <span>Prioridad</span>
            <span>Remito</span>
            <span>Cliente</span>
            <span>Estado</span>
            <span />
          </div>

          {availableRemitos.map((remito) => (
            <button
              key={remito.id}
              className={`remito-row team-remito-row ${remito.id === selectedRemito.id ? 'remito-row-active' : ''}`}
              type="button"
              onClick={() => onSelect(remito.id)}
            >
              <PriorityPill priority={remito.priority} />
              <strong>{remito.id}</strong>
              <span>{remito.client}</span>
              <span className="row-meta">{remito.time} - {remito.zone}</span>
              <StatusPill status={remito.status} />
              <ChevronRight className="row-chevron" size={28} />
            </button>
          ))}
        </section>

        <section className="work-card" aria-label={`Trabajo sobre ${selectedRemito.id}`}>
          <div className="detail-heading">
            <div className="document-icon">
              <FileText size={30} />
            </div>
            <div>
              <h2>{selectedRemito.id}</h2>
              <span className="work-subtitle">{selectedRemito.zone} - {selectedRemito.time}</span>
            </div>
            <StatusPill status={selectedRemito.status} />
          </div>

          <div className="assignment-panel">
            <TeamBadge team={selectedRemito.assignedTeam} />
            {canTake && (
              <button className="take-button" type="button" onClick={takeRemito}>
                <Play size={24} />
                Tomar remito
              </button>
            )}
            {isMine && (
              <button className="release-button" type="button" onClick={releaseRemito}>
                Liberar
              </button>
            )}
            {!canTake && !isMine && (
              <span className="locked-note">
                <AlertTriangle size={20} />
                Lo tiene otro equipo
              </span>
            )}
          </div>

          <div className="detail-info">
            <InfoLine icon={User} label="Cliente" value={selectedRemito.client} strong />
            <InfoLine icon={MapPin} label="Direccion" value={selectedRemito.address} />
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
            const disabled = !isMine && selectedRemito.assignedTeam;
            return (
              <button
                key={status}
                className={`status-action ${config.actionClass}`}
                type="button"
                onClick={() => updateSelectedStatus(status)}
                disabled={disabled}
              >
                <Icon size={34} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </section>

        <section className="team-switcher" aria-label="Cambiar equipo">
          <span>Ver como</span>
          {teams.map((team) => (
            <a className={team === teamId ? 'team-link team-link-active' : 'team-link'} href={`?view=equipo&equipo=${team}`} key={team}>
              {team}
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}

function sortRemitos(remitos) {
  return [...remitos].sort((a, b) => {
    const statusDiff = statusSort[a.status] - statusSort[b.status];
    if (statusDiff !== 0) return statusDiff;
    const priorityDiff = priorityConfig[b.priority].value - priorityConfig[a.priority].value;
    if (priorityDiff !== 0) return priorityDiff;
    return a.time.localeCompare(b.time);
  });
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function PriorityPill({ priority }) {
  const config = priorityConfig[priority];
  return <span className={`priority-pill ${config.className}`}>{config.label}</span>;
}

function TeamBadge({ team }) {
  return team ? (
    <span className="team-badge">
      <Truck size={22} />
      Equipo {team}
    </span>
  ) : (
    <span className="team-badge team-badge-free">
      <ListChecks size={22} />
      Libre
    </span>
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
