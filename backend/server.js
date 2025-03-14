const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
  }));

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const generateSecretHash = (username, clientId, clientSecret) => {
    return crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  };

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email, phone, role, categories } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: generateSecretHash(
      username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'phone_number', Value: phone },
      { Name: 'custom:role', Value: role },
      { Name: 'custom:categories', Value: categories.join(',') }
    ]
  };

  try {
    const response = await cognito.signUp(params).promise();
    res.status(200).json({ 
      message: 'Registration successful. Please check your OTP.',
      data: response 
    });
    } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

// OTP Verification Endpoint
app.post('/api/auth/verify', async (req, res) => {
  const { username, code } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: req.body.username,
    ConfirmationCode: req.body.code,
    SecretHash: generateSecretHash(
      req.body.username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    )
  };
  try {
    const response = await cognito.confirmSignUp(params).promise();
    console.log('Account verified successfully', response);
    res.json({ 
      message: 'Account verified successfully',
      data: response 
    });
    } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

// Resend OTP Endpoint
app.post('/api/auth/resend-otp', async (req, res) => {
  const { username, method } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: req.body.username,
    SecretHash: generateSecretHash(
      req.body.username,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    )
  };

  try {
    await cognito.resendConfirmationCode(params).promise();
    res.json({ message: `OTP resent via ${method}` });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(400).json({ 
      message: error.message,
      code: error.code 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        ...(process.env.COGNITO_CLIENT_SECRET && {
          SECRET_HASH: generateSecretHash(
            username,
            process.env.COGNITO_CLIENT_ID,  // Add this
            process.env.COGNITO_CLIENT_SECRET  // Add this
          )
        })
      }
    };

    // Rest of the code remains the same
    const response = await cognito.initiateAuth(params).promise();
    
    res.json({
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      idToken: response.AuthenticationResult.IdToken,
      expiresIn: response.AuthenticationResult.ExpiresIn
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle common Cognito errors
    let message = 'Login failed';
    if (error.code === 'NotAuthorizedException') {
      message = 'Invalid credentials';
    } else if (error.code === 'UserNotConfirmedException') {
      message = 'User not confirmed';
    }
    
    res.status(400).json({ error: message });
  }
});

app.get('/api/auth/userinfo', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]; // Extract Access Token

    if (!accessToken) {
      return res.status(401).json({ error: "Access Token is required" });
    }

    const params = { AccessToken: accessToken };

    const response = await cognito.getUser(params).promise();
    res.json(response);
  } catch (error) {
    console.error('User info error:', error);
    res.status(400).json({ error: 'Failed to fetch user info' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));