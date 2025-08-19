import { useState } from "react";

export default function NewPermit() {
  const [form, setForm] = useState({
    business_type: "",
    business_name: "",
    owner_first_name: "",
    owner_last_name: "",
    email: "",
    mobile: "",
  });

  const [files, setFiles] = useState({
    dtiCertificate: null,
    secCertificate: null,
    cdaCertificate: null,
    birCertificate: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      const response = await fetch(
        "https://bplo-user.onrender.com/api/permits",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit");

      alert("✅ Permit created successfully!");
      console.log("Permit:", data.permit);
    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <input
        type="text"
        name="business_type"
        placeholder="Business Type"
        value={form.business_type}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="business_name"
        placeholder="Business Name"
        value={form.business_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="owner_first_name"
        placeholder="Owner First Name"
        value={form.owner_first_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="owner_last_name"
        placeholder="Owner Last Name"
        value={form.owner_last_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile (+639...)"
        value={form.mobile}
        onChange={handleChange}
        required
      />

      <label>
        DTI Certificate:
        <input type="file" name="dtiCertificate" onChange={handleFileChange} />
      </label>
      <label>
        SEC Certificate:
        <input type="file" name="secCertificate" onChange={handleFileChange} />
      </label>
      <label>
        CDA Certificate:
        <input type="file" name="cdaCertificate" onChange={handleFileChange} />
      </label>
      <label>
        BIR Certificate:
        <input type="file" name="birCertificate" onChange={handleFileChange} />
      </label>

      <button type="submit">Submit Permit</button>
    </form>
  );
}
