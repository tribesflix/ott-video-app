import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const UploadMovie = ({ closeRef }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcodeProgress, setTranscodeProgress] = useState(0);
  const [load, setLoad] = useState(false);
  const [transcoding, setTranscoding] = useState(false); // New state to check if transcoding is happening

  const [contentUploadData, setContentUploadData] = useState({
    title: "",
    subTitle: "",
    description: "",
    type: "movie",
  });

  const [contentFileInput, setContentFileInput] = useState({
    cardImg: null,
    backgroundImg: null,
    titleImg: null,
    movieURL: null,
    trailerURL: null,
  });

  const handleInputChange = (e) => {
    setContentUploadData({
      ...contentUploadData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = (e) => {
    setContentFileInput({
      ...contentFileInput,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      setLoad(true);
      setUploadProgress(0);
      setTranscodeProgress(0);
    
      // Prepare form data to send to backend
      const formData = new FormData();
      formData.append('video', contentFileInput.movieURL);
      formData.append('title', contentUploadData.title);
      formData.append('subTitle', contentUploadData.subTitle);
      formData.append('description', contentUploadData.description);
      formData.append('type', contentUploadData.type);
    
      // Append other file inputs
      if (contentFileInput.cardImg) {
        formData.append('cardImg', contentFileInput.cardImg);
      }
      if (contentFileInput.backgroundImg) {
        formData.append('backgroundImg', contentFileInput.backgroundImg);
      }
      if (contentFileInput.titleImg) {
        formData.append('titleImg', contentFileInput.titleImg);
      }
      if (contentFileInput.trailerURL) {
        formData.append('trailerURL', contentFileInput.trailerURL);
      }
    
      // Send the data to your backend server with progress tracking
      const response = await axios.post('http://localhost:5000/api/movies/transcode', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
    
      if (response.status === 200) {
        setTranscoding(true); // Start polling for transcoding progress
        pollTranscodingStatus(response.data.jobId); // Pass jobId to poll for transcoding progress
      } else {
        console.error('Error uploading video:', response.data.message);
      }
    
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoad(false);
    }
  };
  
  const pollTranscodingStatus = (jobId) => {
    const intervalId = setInterval(async () => {
      try {
        // Add the jobId as a query parameter to the request
        const response = await axios.get(`http://localhost:5000/api/movies/transcode-status?jobId=${jobId}`);
        
        setTranscodeProgress(response.data.progress); // Update progress
  
        if (response.data.progress >= 100) {
          clearInterval(intervalId); // Clear the interval when transcoding is complete
          setTranscoding(false);
          setLoad(false);
          alert("Transcoding completed successfully.");
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching transcoding status:", error);
        clearInterval(intervalId); // Stop polling on error
        setTranscoding(false);
        setLoad(false);
      }
    }, 5000); // Poll every 5 seconds
  };
  
  const resetForm = () => {
    setContentUploadData({
      title: "",
      subTitle: "",
      description: "",
      type: "movie",
    });

    setContentFileInput({
      cardImg: null,
      backgroundImg: null,
      titleImg: null,
      movieURL: null,
      trailerURL: null,
    });

    setUploadProgress(0);
    setTranscodeProgress(0);
  };

  return (
    <>
      {load ? (
        <ProgressContainer>
          <ProgressText>Uploading: {uploadProgress}%</ProgressText>
          {transcoding && (
            <ProgressText>Transcoding: {transcodeProgress}%</ProgressText>
          )}
        </ProgressContainer>
      ) : (
        <UploadForm onSubmit={handleUpload} method="post">
          <InputGroup>
            <Label>Title</Label>
            <Input
              name="title"
              onChange={handleInputChange}
              value={contentUploadData.title}
              type="text"
              placeholder="Eg: Raya"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Sub Title</Label>
            <Input
              name="subTitle"
              onChange={handleInputChange}
              value={contentUploadData.subTitle}
              type="text"
              placeholder="Eg: 2021 • 1h 52m • Family, Fantasy, Animation, Action-Adventure"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Description</Label>
            <Textarea
              name="description"
              onChange={handleInputChange}
              value={contentUploadData.description}
              placeholder="Eg: Watch with Premier Access at the same time it's in open theaters and before it's available to all Disney+ subscribers on June 4, 2021."
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Card Image</Label>
            <FileInput
              name="cardImg"
              onChange={handleFileInputChange}
              type="file"
              accept="image/*"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Background Image</Label>
            <FileInput
              name="backgroundImg"
              onChange={handleFileInputChange}
              type="file"
              accept="image/*"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Title Image</Label>
            <FileInput
              name="titleImg"
              onChange={handleFileInputChange}
              type="file"
              accept="image/*"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Upload Trailer</Label>
            <FileInput
              name="trailerURL"
              onChange={handleFileInputChange}
              type="file"
              accept="video/*"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Upload Movie</Label>
            <FileInput
              name="movieURL"
              onChange={handleFileInputChange}
              type="file"
              accept="video/*"
              required
            />
          </InputGroup>
          <SubmitButton type="submit">Upload Movie</SubmitButton>
        </UploadForm>
      )}
    </>
  );
};

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ProgressText = styled.p`
  color: #f9f9f9;
  margin-bottom: 10px;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #f9f9f9;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

const FileInput = styled.input`
  padding: 10px;
  border: none;
  outline: none;
`;

const SubmitButton = styled.button`
  background-color: #0063e5;
  color: #f9f9f9;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

export default UploadMovie;
