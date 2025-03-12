import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/styles.css";

const SmartResume: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    about: "",
    skills: "",
    education: "",
    workExperience: [{ company: "", title: "", from: "", to: "", responsibilities: "" }],
    profilePicture: "",
  });

  const [showCV, setShowCV] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Handle text input and textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload for profile picture
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profilePicture: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Show the generated CV
  const generateCV = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    setShowCV(true);
    setPdfDownloaded(false); // Reset PDF download state
    document.querySelector('.resume-container')?.classList.add('show-resume');
  };

  // Convert resume to PDF and download
  const downloadPDF = () => {
    const input = document.getElementById("resume-preview");
    const downloadButton = document.getElementById("download-btn");
    if (!input || !downloadButton) return;

    // Hide the button before capturing
    downloadButton.style.display = 'none';

    setTimeout(() => {
      html2canvas(input, { backgroundColor: "#ffffff", useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("resume.pdf");

        // Show the button again after download
        downloadButton.style.display = 'block';

        // Hide the Download PDF button after downloading
        setPdfDownloaded(true);
      });
    }, 1000);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg rounded-lg">
        <h1 className="text-center text-primary mb-4">Smart Resume</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleProfilePictureUpload} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>About</Form.Label>
            <Form.Control as="textarea" name="about" value={formData.about} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skills</Form.Label>
            <Form.Control type="text" name="skills" value={formData.skills} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Education</Form.Label>
            <Form.Control type="text" name="education" value={formData.education} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" className="w-100 mt-3" onClick={generateCV}>
            Generate CV
          </Button>
        </Form>
      </Card>

      {/* Resume Preview */}
      {showCV && (
        <div id="resume-preview" className="resume-container mt-4">
          <Row>
            <Col md={4} className="left-column text-center">
              {formData.profilePicture && <img src={formData.profilePicture} alt="Profile" className="profile-picture" />}
              <h3>{formData.name}</h3>
              <h4>{formData.jobTitle}</h4>
              <p>{formData.about}</p>
            </Col>
            <Col md={8} className="right-column">
              <h5>Contact Information</h5>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <h5>Skills</h5>
              <p>{formData.skills}</p>
              <h5>Education</h5>
              <p>{formData.education}</p>
              <h5>Work Experience</h5>
              {formData.workExperience.map((job, index) => (
                <div key={index} className="job-experience">
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Title:</strong> {job.title}</p>
                  <p><strong>Duration:</strong> {job.from} - {job.to}</p>
                  <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
                </div>
              ))}
              {!pdfDownloaded && (
                <Button 
                  id="download-btn"
                  variant="success" 
                  className="mt-3" 
                  onClick={downloadPDF}
                >
                  Download PDF
                </Button>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default SmartResume;
