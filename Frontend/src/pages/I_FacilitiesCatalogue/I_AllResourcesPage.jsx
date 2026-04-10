import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './I_AllResourcesPage.css';

// Import components
import I_ResourceSearch from '../../components/I_facilities/I_ResourceSearch';
import I_ResourceFilters from '../../components/I_facilities/I_ResourceFilters';
import I_ResourceGrid from '../../components/I_facilities/I_ResourceGrid';

// Simulated data
const mockResources = [
  {
    id: "res-001", name: "Main Auditorium", type: "Lecture hall", capacity: 500,
    location: "Block A, Level 1", status: "ACTIVE", availabilitySummary: "Available Mon-Fri", imageUrl: "/campus-placeholder.png"
  },
  {
    id: "res-002", name: "Advanced IT Lab", type: "Lab", capacity: 40,
    location: "Block B, Level 3", status: "ACTIVE", availabilitySummary: "Available all week", imageUrl: "/campus-placeholder.png"
  },
  {
    id: "res-003", name: "Conference Room Alpha", type: "Meeting room", capacity: 15,
    location: "Block C, Level 2", status: "ACTIVE", availabilitySummary: "Bookings available", imageUrl: "/campus-placeholder.png"
  },
  {
    id: "res-004", name: "Chemistry Lab C", type: "Lab", capacity: 30,
    location: "Block D, Level 1", status: "OUT_OF_SERVICE", availabilitySummary: "Maintenance until Friday", imageUrl: "/campus-placeholder.png"
  },
  {
    id: "res-005", name: "HD Projector Set", type: "Equipment", capacity: "N/A",
    location: "AV Store Room", status: "ACTIVE", availabilitySummary: "Check out required", imageUrl: "/campus-placeholder.png"
  }
];

const I_AllResourcesPage = () => {
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    maxCapacity: '',
    location: '',
    status: ''
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState('name-asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Simulate initial data load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      setResources(mockResources);
      setFilteredResources(mockResources);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle Search & Filter & Sort
  const applyFilters = () => {
    let result = [...resources];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(res => 
        res.name.toLowerCase().includes(term) || 
        res.type.toLowerCase().includes(term) || 
        res.location.toLowerCase().includes(term)
      );
    }

    // Advanced filters
    if (filters.type) {
      result = result.filter(res => res.type === filters.type);
    }
    if (filters.location) {
      result = result.filter(res => res.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.status) {
      result = result.filter(res => res.status === filters.status);
    }
    if (filters.minCapacity) {
      result = result.filter(res => res.capacity !== 'N/A' && parseInt(res.capacity) >= parseInt(filters.minCapacity));
    }
    if (filters.maxCapacity) {
      result = result.filter(res => res.capacity !== 'N/A' && parseInt(res.capacity) <= parseInt(filters.maxCapacity));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'capacity-asc') {
        const capA = a.capacity === 'N/A' ? 0 : parseInt(a.capacity);
        const capB = b.capacity === 'N/A' ? 0 : parseInt(b.capacity);
        return capA - capB;
      }
      if (sortBy === 'capacity-desc') {
        const capA = a.capacity === 'N/A' ? 0 : parseInt(a.capacity);
        const capB = b.capacity === 'N/A' ? 0 : parseInt(b.capacity);
        return capB - capA;
      }
      return 0;
    });

    setFilteredResources(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    // Only search term and sorting apply automatically. Filters require clicking Apply
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, resources]);

  const resetFilters = () => {
    setFilters({
      type: '',
      minCapacity: '',
      maxCapacity: '',
      location: '',
      status: ''
    });
    setSearchTerm('');
    setSortBy('name-asc');
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <div className="all-resources-page">
      <div className="arp-header">
        <h1>Resource Catalogue</h1>
        <p>Find and book available facilities, halls, and academic resources across campus.</p>
      </div>

      <div className="arp-main-content">
        {/* Left Side: Filters */}
        <aside className="arp-sidebar">
          <I_ResourceFilters 
            filters={filters} 
            setFilters={setFilters} 
            onApply={handleApplyFilters} 
            onReset={resetFilters} 
          />
        </aside>

        {/* Right Side: Search, Sort, Grid */}
        <div className="arp-catalog-area">
          <div className="arp-toolbar">
            <div className="arp-search-wrapper">
              <I_ResourceSearch 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
              />
            </div>
            <div className="arp-sort-wrapper">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="arp-sort-select"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="capacity-asc">Capacity (Low to High)</option>
                <option value="capacity-desc">Capacity (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="arp-results-info">
            Showing {filteredResources.length} resources
          </div>

          <I_ResourceGrid 
            resources={currentItems} 
            loading={loading}
            onViewDetails={(res) => navigate(`/facilities/${res.id}`)}
            onQuickBook={(res) => navigate(`/booking/new?resourceId=${res.id}`)}
          />

          {/* Simple Inline Pagination */}
          {!loading && totalPages > 1 && (
            <div className="arp-pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default I_AllResourcesPage;
