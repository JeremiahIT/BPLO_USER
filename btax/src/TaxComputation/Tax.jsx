import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Plus, Trash2, Printer, Upload, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Tax.css";

const BusinessTaxPage = () => {
  // Tax states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState("January-March");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  // PDF Library states
  const [pdfFiles, setPdfFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Calculate total
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0));
  }, [items]);

  // Handle Save Tax Item
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...editingItem, description, amount: parseFloat(amount), year, period }
            : item
        )
      );
      setEditingItem(null);
    } else {
      setItems([...items, { id: Date.now(), description, amount: parseFloat(amount), year, period }]);
    }
    setDescription("");
    setAmount("");
  };

  const handleDeleteItem = (id) => setItems(items.filter((item) => item.id !== id));
  const handleEditItem = (item) => {
    setEditingItem(item);
    setDescription(item.description);
    setAmount(item.amount);
    setYear(item.year);
    setPeriod(item.period);
  };

  // PDF generation for tax items
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Added Tax Items", 20, 20);

    const tableData = items.map((item) => [
      item.description,
      `₱ ${item.amount.toFixed(2)}`,
      item.year.toString(),
      item.period,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Description", "Amount", "Year", "Period"]],
      body: tableData.length > 0 ? tableData : [["No items added yet.", "", "", ""]],
      theme: "striped",
    });

    if (items.length > 0) {
      const finalY = doc.lastAutoTable.finalY || 30;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(`Total Amount: ₱ ${total.toFixed(2)}`, 20, finalY + 10);
    }

    doc.save("Tax_Items.pdf");
  };

  // ✅ Handle PDF Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const newFile = {
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        createdAt: new Date().toLocaleString(),
      };
      setPdfFiles([...pdfFiles, newFile]);
    }
  };

  // ✅ Delete PDF file
  const handleDeletePdf = (id) => {
    setPdfFiles(pdfFiles.filter((file) => file.id !== id));
  };

  // ✅ Filtered files by search
  const filteredPdfFiles = pdfFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper grid grid-cols-2 gap-6">
      {/* ================= Left Side: Tax Form + Items ================= */}
      <div>
        {/* Header */}
        <header className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className="content-title">Business Tax Division</h2>
        </header>

        {/* Form */}
        <div className="form-card">
          <h3 className="card-title">{editingItem ? "Edit Tax Information" : "Add New Tax Information"}</h3>
          <form onSubmit={handleSaveItem} className="tax-form">
            <div className="form-row">
              <div className="form-group flex-grow">
                <label htmlFor="description" className="form-label">Description</label>
                <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="input-field" />
              </div>
              <div className="form-group form-amount">
                <label htmlFor="amount" className="form-label">Amount (₱)</label>
                <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="input-field" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-half">
                <label htmlFor="year" className="form-label">Year</label>
                <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="input-field" />
              </div>
              <div className="form-group form-half">
                <label htmlFor="period" className="form-label">Period</label>
                <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field">
                  <option value="January-March">January-March</option>
                  <option value="April-June">April-June</option>
                  <option value="July-September">July-September</option>
                  <option value="October-December">October-December</option>
                </select>
              </div>
            </div>

            <button type="submit" className="action-button primary-button">
              {editingItem ? <Edit size={16} className="button-icon" /> : <Plus size={16} className="button-icon" />}
              {editingItem ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="table-card">
          <h3 className="card-title">Added Tax Items</h3>
          <div className="table-container">
            <table className="tax-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Year</th>
                  <th>Period</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>₱ {item.amount.toFixed(2)}</td>
                      <td>{item.year}</td>
                      <td>{item.period}</td>
                      <td>
                        <button onClick={() => handleEditItem(item)}><Edit size={18} /></button>
                        <button onClick={() => handleDeleteItem(item.id)}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No items added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="summary-card">
            <div className="total-row">
              <span className="total-label">Total Amount:</span>
              <span className="total-amount">₱ {total.toFixed(2)}</span>
            </div>
            <button onClick={handlePrint} className="action-button secondary-button">
              <Printer size={16} className="button-icon" /> Print / Save as PDF
            </button>
          </div>
        )}
      </div>

      {/* ================= Right Side: PDF Library ================= */}
      <div>
        <div className="form-card">
          <h3 className="card-title flex items-center gap-2">
            <Upload size={18} /> Upload PDF Files
          </h3>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="input-field" />
        </div>

        <div className="table-card">
          <h3 className="card-title flex items-center gap-2">
            <Search size={18} /> Search PDFs
          </h3>
          <input
            type="text"
            placeholder="Search PDF files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field mb-3"
          />
          <div className="table-container">
            <table className="tax-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPdfFiles.length > 0 ? (
                  filteredPdfFiles.map((file) => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{file.createdAt}</td>
                      <td className="flex gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-button secondary-button"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeletePdf(file.id)}
                          className="action-button danger-button"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No PDF files uploaded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTaxPage;
