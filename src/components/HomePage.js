import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Typography, 
  useTheme, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
  Stack,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Feature cards data with higher quality image URLs
  const features = [
    {
      title: "Document Processing",
      description: "Advanced OCR technology extracts and processes text from documents, making them searchable and analyzable.",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      action: () => navigate('/upload'),
      imageUrl: "https://images.unsplash.com/photo-1590103514966-5e2a11c13e21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90"
    },
    {
      title: "Case Management",
      description: "Efficiently track and manage debt collection cases from initiation to resolution.",
      icon: <BusinessCenterOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      action: () => navigate('/cases'),
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90"
    },
    {
      title: "Invoice Management",
      description: "Create, process and manage invoices with intelligent template detection.",
      icon: <ReceiptOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      action: () => navigate('/invoices'),
      imageUrl: "https://evobreyta.com/User/Blog/09042024050308Blog.png"
    },
    {
      title: "Analytics Dashboard",
      description: "Visualize key metrics and gain insights into your debt collection performance.",
      icon: <InsightsOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      action: () => navigate('/dashboard'),
      imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90"
    },
    {
      title: "Document Categorization",
      description: "AI-powered categorization and entity extraction from legal and financial documents.",
      icon: <CategoryOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      action: () => navigate('/'),
      imageUrl: "https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90"
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: '650px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          overflow: 'hidden',
          mb: 0
        }}
      >
        {/* Background Image with Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2,
            backgroundImage: 'url(https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2100&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8)',
          }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: 'linear-gradient(135deg, rgba(18, 41, 76, 0.9) 0%, rgba(25, 118, 210, 0.8) 100%)',
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
            <Box sx={{ 
    textAlign: 'center',  
    py: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center' 
  }}>
               <Typography 
      variant="h2" 
      component="h1" 
      gutterBottom
      sx={{ 
        fontWeight: 800,
        mb: 2,
        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        lineHeight: 1.1,
        color: theme.palette.secondary.light,
        textAlign: 'center'  
      }}
    >TexSynth
    </Typography>
    <Typography 
      variant="h5" 
      component="div" 
      sx={{ 
        mb: 5,
        opacity: 0.9,
        fontWeight: 400,
        maxWidth: { md: '80%' },
        color: theme.palette.text.secondary,
        textAlign: 'center'  
      }}
    >
      Streamline your debt collection process with our intelligent document management solution
    </Typography>
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2}
      justifyContent="center"  
    >
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/dashboard')}
        sx={{ 
          bgcolor: 'white', 
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          borderRadius: 2
        }}
      >
        Get Started
      </Button>
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/upload')}
        sx={{ 
          bgcolor: 'white', 
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          borderRadius: 2
        }}
      >
       Try Demo
      </Button>
    </Stack>
  </Box>
</Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box  
                sx={{ 
                  position: 'relative',
                  height: 500,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=90"
                  alt="Analytics Dashboard"
                  sx={{
                    width: '90%',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                    transition: 'all 0.5s',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg) translateY(-10px)',
                      boxShadow: '0 30px 50px rgba(0,0,0,0.4)',
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 10, 
       
        mb: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.text.primary 
              }}
            >
              Our Features
            </Typography>
            <Divider sx={{ 
              width: '80px', 
              margin: '0 auto', 
              borderBottomWidth: 4, 
              borderColor: theme.palette.primary.main, 
              mb: 2 
            }} />
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                color: theme.palette.text.secondary 
              }}
            >
              Comprehensive tools designed for effective debt collection and document management
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ py: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index} sx={{ display: 'flex' }}>
                <Card 
  sx={{
    height: '100%', 
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
      borderColor: 'transparent',
      '& .card-image': {
        transform: 'scale(1.05)'
      }
    }
  }}
>
  {/* Image Section */}
  <Box
    sx={{
      position: 'relative',
      height: '200px',
      width: '100%',
      overflow: 'hidden',
      flexShrink: 0
    }}
  >
    <Box
      component="img"
      className="card-image"
      src={feature.imageUrl}
      alt={feature.title}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease-in-out',
      }}
    />
    
    <Box
      sx={{
        position: 'absolute',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))'
      }}
    />
    
    {/* Icon Badge */}
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {feature.icon}
    </Box>
    
    {/* Title Overlay */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 3,
        color: 'white',
      }}
    >
      <Typography 
        variant="h5" 
        component="h3"
        sx={{
          fontWeight: 700,
          lineHeight: 1.2,
          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}
      >
        {feature.title}
      </Typography>
    </Box>
  </Box>

  {/* Content Section */}
  <CardContent
    sx={{
      flex: '1 1 auto',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.paper'
    }}
  >
    <Typography 
      variant="body1"
      color="text.secondary"
      sx={{
        mb: 3,
        flexGrow: 1, 
        lineHeight: 1.5
      }}
    >
      {feature.description}
    </Typography>
    
    <Button
      variant="contained"
      color="primary"
      onClick={feature.action}
      size="medium"
      sx={{
        alignSelf: 'flex-end',
        px: 3,
        fontWeight: 600,
        borderRadius: '8px',
        '&:hover': {
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.2s ease'
      }}
      endIcon={<ArrowForwardIcon />}
    >
      Learn More
    </Button>
  </CardContent>
</Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      
     {/* CTA Section */}
<Box 
  sx={{ 
    py: 10,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(135deg, #4a148c 0%, #7c43bd 100%)',
    color: 'white',
    textAlign: 'center'
  }}
>
  {/* Decorative elements */}
  <Box 
    sx={{ 
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: '50%',
      bgcolor: 'rgba(255,255,255,0.05)',
      zIndex: 0
    }}
  />
  <Box 
    sx={{ 
      position: 'absolute',
      bottom: -80,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: '50%',
      bgcolor: 'rgba(255,255,255,0.05)',
      zIndex: 0
    }}
  />
  
  <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
      <Typography 
        variant="h3" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontWeight: 800,
          mb: 3,
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        Ready to transform your debt collection process?
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 5, 
          maxWidth: 700, 
          mx: 'auto',
          opacity: 0.9,
          lineHeight: 1.6
        }}
      >
        Our intelligent system helps you optimize workflows, reduce manual effort, and improve recovery rates with advanced AI technology.
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        color="primary"
        onClick={() => navigate('/dashboard')}
        sx={{ 
          bgcolor: 'white', 
          color: theme.palette.secondary.main,
          px: 5, 
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          '&:hover': {
            bgcolor: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            transform: 'translateY(-3px)'
          },
          transition: 'all 0.3s'
        }}
      >
        View Dashboard
      </Button>
    </Box>
  </Container>
</Box>

{/* Footer Section */}
<Box 
  component="footer" 
  sx={{ 
    bgcolor: theme.palette.primary.dark,
    color: 'white',
    mt:5,
    pt: 6,
    pb: 3,
    textAlign: 'center'
  }}
>
  <Container maxWidth="lg">
    {/* Logo/Branding */}
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      <Box sx={{ 
        bgcolor: 'white', 
        height: 70, 
        width: 70, 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <DescriptionOutlinedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      </Box>
    </Box>
    
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 5 }}>
      DebtDoc<span style={{ fontWeight: 400 }}>Discovery</span>
    </Typography>
    
    {/* Footer Links Grid */}
    <Grid container spacing={6} justifyContent="center">
      {/* Solutions Column */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Solutions
        </Typography>
        <List component="nav" dense disablePadding>
          {['Document Management', 'Case Tracking', 'Invoice Processing', 'Data Analytics', 'OCR Technology'].map((item) => (
            <ListItem disablePadding key={item} sx={{ mb: 1, justifyContent: 'center' }}>
              <ListItemText 
                primary={
                  <Link 
                    component="button" 
                    underline="hover"
                    sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    {item}
                  </Link>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Resources Column */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Resources
        </Typography>
        <List component="nav" dense disablePadding>
          {['Knowledge Base', 'Documentation', 'User Guides', 'Webinars', 'Blog'].map((item) => (
            <ListItem disablePadding key={item} sx={{ mb: 1, justifyContent: 'center' }}>
              <ListItemText 
                primary={
                  <Link 
                    component="button" 
                    underline="hover"
                    sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    {item}
                  </Link>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Company Column */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Company
        </Typography>
        <List component="nav" dense disablePadding>
          {['About Us', 'Our Team', 'Careers', 'Partner Program', 'Contact'].map((item) => (
            <ListItem disablePadding key={item} sx={{ mb: 1, justifyContent: 'center' }}>
              <ListItemText 
                primary={
                  <Link 
                    component="button" 
                    underline="hover"
                    sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    {item}
                  </Link>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Contact Column */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Contact Us
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              (800) 555-0123
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              support@debtdoc.com
            </Typography>
          </Stack>
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Connect with us
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton aria-label="LinkedIn" sx={{ color: 'white' }}>
            <LinkedInIcon />
          </IconButton>
          <IconButton aria-label="Facebook" sx={{ color: 'white' }}>
            <FacebookIcon />
          </IconButton>
          <IconButton aria-label="Twitter" sx={{ color: 'white' }}>
            <TwitterIcon />
          </IconButton>
        </Stack>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.5)', 
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Get Support
          </Button>
        </Box>
      </Grid>
    </Grid>

    {/* Footer Divider */}
    <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
    
    {/* Copyright and Legal Links */}
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        © {new Date().getFullYear()} DebtDoc Discovery. All rights reserved.
      </Typography>
    </Box>
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={{ xs: 1, sm: 3 }}
      justifyContent="center"
    >
      {['Privacy Policy', 'Terms of Service', 'Security', 'Accessibility'].map((item) => (
        <Typography key={item} variant="body2" sx={{ opacity: 0.6 }}>
          <Link href="#" underline="hover" sx={{ color: 'white' }}>
            {item}
          </Link>
        </Typography>
      ))}
    </Stack>
  </Container>
</Box>
    </Box>
  );
};

export default HomePage;