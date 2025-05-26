import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/Table.jsx';
import { formatDistanceToNow } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";



const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchLogs = async (pageNumber = 1) => {
      setLoading(true);
      setError(null);
  
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/logs/?page=${pageNumber}&page_size=20`, {
            headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  
        const data = await res.json();
        const logResults = data.results || [];
  
        setLogs(logResults);
        setFilteredLogs(logResults);
        setTotalPages(data.total_pages || 1);
        setPage(pageNumber);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLogs();
    }, []);
  
    useEffect(() => {
      const filtered = logs.filter((log) =>
        log.message.toLowerCase().includes(query.toLowerCase()) ||
        (log.user || "system").toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLogs(filtered);
    }, [query, logs]);
  
    const exportCSV = () => {
      const csv = Papa.unparse(logs);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "logs.csv";
      a.click();
    };
  
    const exportPDF = () => {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Timestamp", "Level", "User", "Message"]],
        body: logs.map((log) => [
          new Date(log.timestamp).toLocaleString(),
          log.level.toUpperCase(),
          log.user || "System",
          log.message,
        ]),
      });
      doc.save("logs.pdf");
    };
  
    return (
      <div className="logs-container">
        <h1>System Logs</h1>
  
        {error && <p className="error">Error: {error}</p>}
  
        <input
          type="text"
          placeholder="Search logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="log-search"
        />
  
        <div className="export-buttons">
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={exportPDF}>Export PDF</button>
        </div>
  
        {loading ? (
          <p>Loading logs...</p>
        ) : (
          <>
            <Table>
              <TableCaption>System logs and events.</TableCaption>
              <TableHeader>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" style={{ textAlign: "center" }}>
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell title={new Date(log.timestamp).toLocaleString()}>
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <span className={`badge ${log.level.toLowerCase()}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{log.user || "System"}</TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
  
            <div className="pagination">
              <button onClick={() => fetchLogs(page - 1)} disabled={page <= 1}>
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchLogs(i + 1)}
                  className={i + 1 === page ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => fetchLogs(page + 1)} disabled={page >= totalPages}>
                Next
              </button>
            </div>
          </>
        )}
  
        <style>{`
          .logs-container {
            padding: 20px;
            }

            .log-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            }

            .log-search {
            padding: 8px;
            width: 250px;
            font-size: 14px;
            }

            .export-buttons button {
            margin-left: 10px;
            padding: 6px 10px;
            font-size: 14px;
            cursor: pointer;
            }

            .logs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            }

            .logs-table th,
            .logs-table td {
            border: 1px solid #ddd;
            padding: 8px;
            }

            .logs-table th {
            background-color: #f4f4f4;
            }

            .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            }

            .badge-info {
            background-color: #17a2b8;
            }

            .badge-warning {
            background-color: #ffc107;
            }

            .badge-error {
            background-color: #dc3545;
            }

            .pagination {
            margin-top: 15px;
            display: flex;
            gap: 5px;
            justify-content: center;
            }

            .pagination button {
            padding: 5px 10px;
            }

            .active-page {
            background-color: #007bff;
            color: white;
            }

        `}</style>
      </div>
    );
  };
  
  export default LogsPage;