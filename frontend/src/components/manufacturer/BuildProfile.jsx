import React, { useReducer, useState, useEffect } from 'react';
import Stepper, { Step } from '../../assets/Stepper';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../assets/Categories';
import axios from 'axios';
import { extractCategory } from '../../assets/extractCategory';

const initialState = {
  name: '',
  email: '',
  phone: '',
  company_type: '',
  GST_no: '',
  PAN_no: '',
  categories: [],
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  },
  year_of_establishment: '',
  website: '',
  logo_url: '',
  certifications: [],
  documents: {
    gst_certificate: '',
    pan_card: '',
    incorporation_certificate: '',
    others: [],
  },
  contact_person: {
    name: '',
    designation: '',
    email: '',
    phone: '',
  },
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_NESTED_FIELD':
      return {
        ...state,
        [action.parent]: {
          ...state[action.parent],
          [action.field]: action.value,
        },
      };
    case 'ADD_TO_ARRAY':
      return {
        ...state,
        [action.array]: [...state[action.array], action.value],
      };
    case 'REMOVE_FROM_ARRAY':
      return {
        ...state,
        [action.array]: state[action.array].filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
}

const ManufacturerStepper = ({ onSubmit }) => {
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValid, setStepValid] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, isAuthenticated, getEmailFromUser, getCategoriesFromUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const categories = getCategories();
  const [files, setFiles] = useState({
    gst_certificate: null,
    pan_card: null,
    incorporation_certificate: null,
    other_documents: [],
  });


  const getUploadedUrls = async (files, username) => {
    try {
      const uploadedUrls = await handleFileUpload(files, username);
      return uploadedUrls; // { gst_certificate: [...], pan_card: [...], ... }
    } catch (error) {
      console.error("Error getting uploaded URLs:", error);
      return null;
    }
  };
  
  useEffect(() => {
    if (userEmail) {
      dispatch({ type: 'UPDATE_FIELD', field: 'email', value: userEmail });
    }
  }, [userEmail, dispatch]);
  
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        alert('You are not logged in');
        navigate('/auth', { replace: true });
      }
      setLoading(false);
      if (user) {
        setUserEmail(getEmailFromUser());
        let userCategoryIds = getCategoriesFromUser();

    // If it's a comma-separated string, convert it to array
    if (typeof userCategoryIds === 'string') {
      userCategoryIds = userCategoryIds.split(',').map(id => id.trim());
    }

    // Proceed only if we have a valid array
    if (Array.isArray(userCategoryIds) && userCategoryIds.length > 0) {
      const matchedNames = userCategoryIds
        .map(id => {
          const category = categories.find(cat => cat.id === id);
          return category ? category.name : null;
        })
        .filter(Boolean);
      dispatch({ type: 'UPDATE_FIELD', field: 'categories', value: matchedNames });
    }
      }    
    };

    checkAuth();
  }, [isAuthenticated, navigate]);

  const handleFileUpload = async (filesObj, username) => {
    const formData = new FormData();
    formData.append('username', username);
  
    // Append each file
    Object.keys(filesObj).forEach(field => {
      const files = filesObj[field];
      if (Array.isArray(files)) {
        files.forEach(file => formData.append(field, file));
      } else {
        formData.append(field, files);
      }
    });
  
    try {
      const res = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded:', res.data.uploaded);
      return res.data.uploaded;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };  
  

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Business Name is required';
        if (!userEmail.trim()) {
          newErrors.email = 'Email is required';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone is required';
        } else if (!/^\+91[6789][0-9]{9}$/.test(formData.phone)) {
          newErrors.phone = 'Phone must be 10 digits';
        }
        if (!formData.company_type) newErrors.company_type = 'Company Type is required';
        break;
      case 2:
        if (!formData.GST_no.trim()) {
          newErrors.GST_no = 'GST Number is required';
        } else if (formData.GST_no.length !== 15) {
          newErrors.GST_no = 'GST Number must be 15 characters';
        }
        if (!formData.PAN_no.trim()) {
          newErrors.PAN_no = 'PAN Number is required';
        } else if (formData.PAN_no.length !== 10) {
          newErrors.PAN_no = 'PAN Number must be 10 characters';
        }
        if (!formData.year_of_establishment) {
          newErrors.year_of_establishment = 'Year is required';
        }
        if (formData.categories.length === 0) {
          newErrors.categories = 'At least one category is required';
        }
        break;
      case 3:
        if (!formData.address.line1.trim()) newErrors['address.line1'] = 'Address Line 1 is required';
        if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
        if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
        if (!formData.address.pincode.trim()) {
          newErrors['address.pincode'] = 'Pincode is required';
        } else if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
          newErrors['address.pincode'] = 'Invalid pincode (6 digits required)';
        }
        break;
      case 6:
        if (!formData.documents.gst_certificate) newErrors['documents.gst_certificate'] = 'GST Certificate is required';
        if (!formData.documents.pan_card) newErrors['documents.pan_card'] = 'PAN Card is required';
        break;
      default:
        break;
    }
    return Object.keys(newErrors).length > 0 ? newErrors : "noErrors";
  };

  useEffect(() => {
    const stepErrors = validateStep(currentStep);
    console.log(stepErrors);
    if (stepErrors === "noErrors") {
      setStepValid(true);
    }
    setErrors(stepErrors || {});
  }, [formData, currentStep]);


  const handleProfileSubmit = async () => {
    try {
      const username = user.Username || 'default_user';
      const uploadedUrls = await getUploadedUrls(files, username);
  
      if (!uploadedUrls) {
        alert('File upload failed. Please try again.');
        return;
      }
  
      // Merge uploaded file URLs into formData
      const updatedForm = {
        ...formData,
        documents: {
          gst_certificate: uploadedUrls.gst_certificate?.[0] || '',
          pan_card: uploadedUrls.pan_card?.[0] || '',
          incorporation_certificate: uploadedUrls.incorporation_certificate?.[0] || '',
          others: uploadedUrls.other_documents || [],
        },
      };
  
      // Simple validation before submitting
      const requiredFields = ['name', 'email', 'phone', 'company_type', 'GST_no', 'PAN_no'];
      for (let field of requiredFields) {
        if (!updatedForm[field]) {
          alert(`Missing required field: ${field}`);
          return;
        }
      }
  
      // POST to backend API
      const res = await axios.post('http://localhost:3001/api/create-profile', updatedForm);
      if (res.status === 200) {
        alert('Profile created successfully! Please wait for admin verification and approval. Redirecting...');
        navigate('/dashboard'); // or wherever you want
      }
    } catch (err) {
      console.error('Profile submission error:', err);
      alert('Something went wrong while creating the profile.');
    }
  };
  

  return (
    <Stepper
      initialStep={1}
      onStepChange={setCurrentStep}
      onFinalStepCompleted={handleProfileSubmit}
      nextButtonProps={{ disabled: !stepValid }}
      backButtonText="Back"
      nextButtonText={currentStep === 6 ? 'Submit' : 'Next'}
    >
      {/* Step 1: Basic Information */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <InputField
            label="Business Name"
            value={formData.name}
            placeholder="example: XYZ Pvt Ltd"
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
            error={errors.name}
            required
          />
          {user === undefined ? (
            <div>Loading...</div>
            ) : userEmail ? (
            <InputField
                label="Email"
                type="email"
                value={userEmail}
                placeholder={userEmail}
                readOnly
            />
            ) : (
            <div>User not logged in</div>
            )}
          <InputField
            label="Phone"
            type="tel"
            pattern="\+91[6789][0-9]{9}"
            value={formData.phone}
            error={errors.phone}
            placeholder="example: +917825252922"
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: e.target.value })}
            required
          />
          <SelectField
            label="Company Type"
            value={formData.company_type}
            error={errors.company_type}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'company_type', value: e.target.value })}
            options={['Proprietorship', 'Partnership', 'Pvt Ltd', 'LLP', 'Public Ltd']}
            required
          />
        </div>
      </Step>

      {/* Step 2: Business Details */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Business Details</h2>
        <div className="space-y-4">
          <InputField
            label="GST Number"
            value={formData.GST_no}
            error={errors.GST_no}
            placeholder="example: 123456789012345"
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'GST_no', value: e.target.value })}
            required
          />
          <InputField
            label="PAN Number"
            value={formData.PAN_no}
            error={errors.PAN_no}
            placeholder="example: ABCDE1234F"
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'PAN_no', value: e.target.value })}
            required
          />
          <InputField
            label="Year of Establishment"
            type="number"
            value={formData.year_of_establishment}
            error={errors.year_of_establishment}
            placeholder="example: 2020"
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'year_of_establishment', value: e.target.value })}
            required
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">Product Categories</label>
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </Step>

      {/* Step 3: Address Information */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Address Information</h2>
        <div className="space-y-4">
          <InputField
            label="Address Line 1"
            value={formData.address.line1}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'address', field: 'line1', value: e.target.value })}
            required
          />
          <InputField
            label="Address Line 2"
            value={formData.address.line2}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'address', field: 'line2', value: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              value={formData.address.city}
              onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'address', field: 'city', value: e.target.value })}
              required
            />
            <InputField
              label="State"
              value={formData.address.state}
              onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'address', field: 'state', value: e.target.value })}
              required
            />
            <InputField
              label="Pincode"
              value={formData.address.pincode}
              onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'address', field: 'pincode', value: e.target.value })}
              required
            />
          </div>
        </div>
      </Step>

      {/* Step 4: Additional Information */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
        <div className="space-y-4">
          <InputField
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'website', value: e.target.value })}
          />
          <FileInput
            label="Company Logo"
            onChange={(file) => dispatch({ type: 'UPDATE_FIELD', field: 'logo_url', value: file })}
          />
          <TagsInput
            label="Certifications"
            tags={formData.certifications}
            onAdd={(tag) => dispatch({ type: 'ADD_TO_ARRAY', array: 'certifications', value: tag })}
            onRemove={(index) => dispatch({ type: 'REMOVE_FROM_ARRAY', array: 'certifications', index })}
          />
        </div>
      </Step>

      {/* Step 5: Contact Person */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Contact Person</h2>
        <div className="space-y-4">
          <InputField
            label="Name"
            value={formData.contact_person.name}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'contact_person', field: 'name', value: e.target.value })}
          />
          <InputField
            label="Designation"
            value={formData.contact_person.designation}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'contact_person', field: 'designation', value: e.target.value })}
          />
          <InputField
            label="Email"
            type="email"
            value={formData.contact_person.email}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'contact_person', field: 'email', value: e.target.value })}
          />
          <InputField
            label="Phone"
            type="tel"
            value={formData.contact_person.phone}
            onChange={(e) => dispatch({ type: 'UPDATE_NESTED_FIELD', parent: 'contact_person', field: 'phone', value: e.target.value })}
          />
        </div>
      </Step>

      {/* Step 6: Document Upload */}
      <Step>
        <h2 className="text-2xl font-bold mb-4">Document Upload</h2>
        <div className="space-y-4">
        <FileInput
          label="GST Certificate"
          required
          onChange={(file) => setFiles(prev => ({ ...prev, gst_certificate: file }))}
        />

        <FileInput
          label="PAN Card"
          required
          onChange={(file) => setFiles(prev => ({ ...prev, pan_card: file }))}
        />

        <FileInput
          label="Incorporation Certificate"
          onChange={(file) => setFiles(prev => ({ ...prev, incorporation_certificate: file }))}
        />

        <FileInput
          label="Other Documents"
          multiple
          onChange={(fileList) => setFiles(prev => ({ ...prev, other_documents: Array.from(fileList) }))}
        />


        </div>
      </Step>
    </Stepper>
  );
};

// Helper components
const InputField = ({ label, value,error, onChange, type = 'text', required = false, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="p-2 border rounded"
      required={required}
      {...props}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const SelectField = ({ label, value,error, onChange, options, required = false }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="p-2 border text-var(--color-heading) rounded bg-[var(--secondary)]"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const TagsInput = ({ label, tags, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 px-2 py-1 rounded flex items-center">
            {tag}
            <button
              type="button"
              className="ml-1 text-red-500"
              onClick={() => onRemove(index)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded flex-1"
          placeholder="Add tag..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>
    </div>
  );
};

const FileInput = ({ label, onChange, required = false, multiple = false }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      onChange={(e) => onChange(multiple ? e.target.files : e.target.files[0])}
      className="p-2 border rounded"
      required={required}
      multiple={multiple}
    />
  </div>
);

export default ManufacturerStepper;