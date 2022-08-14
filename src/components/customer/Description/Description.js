import { Avatar, Button, } from '@mui/material'
import React, { useState, useEffect } from 'react'
import UserLayout from '../UserLayout'
import SwipImage from './SwipImage'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Grid, Divider, Paper, Typography, Snackbar, Alert, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from '@mui/material'
import SimilarProduct from './SimilarProduct'
import Comment from './Comment'
import { useAuth } from '../../../utils/auth'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Link } from 'react-router-dom'
import ContactsIcon from '@mui/icons-material/Contacts';

const Description = () => {
  const { id } = useParams()
  const [specification, setSpecification] = useState([])
  const [type, setType] = useState({})
  const [Loading, setLoading] = useState(true)
  const [details, setDetails] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [open, setOpen] = useState(false);
  const [showDesc, setShowDesc] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate();
  const auth = useAuth();
  /// for contact dialog box
  const [openContact, setOpenContact] = React.useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');



  useEffect(() => {
    axios.get(`http://localhost:8000/api/product/${id}/`)
      .then(response => {
        // console.log(response.data)
        setLoading(false)
        setDetails(response.data)
        setSpecification(response.data.productattributevalues)
        setType(response.data.type)
        // console.log(response.data)

      }).catch(error => {
        if (error) {
          navigate('/')
          setLoading(true)
        }
      })

  }, [id, navigate])


  useEffect(() => {
    if (details.user) {
      axios.get(`http://localhost:8000//user-info/${details.user}`, {
        headers: {
          Authorization: `Bearer ${auth.access}`
        }
      }).then(response => {
        // console.log(response.data)
        setUserInfo(response.data)
      }).catch(error => {
        console.log(error)
      })

    }
  }, [details, auth.access])




  // to open contact dialog box
  const handleClickOpen = () => {
    setOpenContact(true);
  };

  // to  close contact dialog box
  const handleContactClose = () => {
    setOpenContact(false);
  };

  const sendMessage = () => {
    if (subject.length <= 3) {
      alert("Subject word should be greater than 3");
      return
    }
    if (message.length <= 3) {
      alert("Message word should be greater than 3")
      return
    }

    axios.post('http://localhost:8000/api/contact/', {
      product: `${id}`,
      subject: subject,
      message: message
    }, {
      headers: {
        Authorization: `Bearer ${auth.access}`
      }
    }).then(res => {
      console.log(res.data);
      alert(res.data.success);
      handleContactClose()
      setSubject('')
      setMessage('')
    }).catch(err => {
      alert("something went wrong")
    })
  }



  const funcSave = (id) => {
    axios.post('http://localhost:8000/api/saved-list/', { product: `${id}` }, {
      headers: {
        Authorization: `Bearer ${auth.access}`
      },

    }).then(res => {
      // console.log(res.data)
      setOpen(true);
      setSuccess('Succesfully Saved to the Saved list')
    }).catch(err => {
      console.log(err)
      setOpen(true);
      setError(err.response.data.detail)
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleClick = () => {
    setShowDesc(!showDesc)
  }

  // if (userInfo === null || Loading) return 'Loading................'
  // if (userInfo === null) return 'Loading................'
  if (Loading) return 'Loading................'


  return (
    <>
      {error &&
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      }
      {
        success &&
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      }

      <UserLayout />

      {/* contact form open */}
      {auth.access &&
        <Dialog open={openContact} onClose={handleContactClose}>
          <DialogTitle>Contact to anish ghimire product owner</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleContactClose}>Cancel</Button>
            <Button onClick={sendMessage}>Send </Button>
          </DialogActions>
        </Dialog>
      }
      {/* contact form close */}


      <div className='ml-[77px] flex flex-wrap space-x-5 justify-around pl-[3rem] '>

        {/* 1st flex */}
        <div className="product-info">

          <SwipImage id={id} />

          <div className='flex justify-between items-center mt-2'>
            {/* <h1>30 views</h1> */}
            <h3>{details.condition}</h3>
            <h2>Qty:{details.quantity === null ? 'No qty' : details.quantity}</h2>
          </div>
          <div className='flex justify-between items-center mt-2'>
            <h1 className="text-lg">Rs</h1>
            <h3 className="text-lg">{details.price}</h3>
          </div>
          <div className='mt-3'>
            <Paper elevation={12} sx={{ background: "#eee" }} >

              {
                userInfo === null ? '' :
                  <>
                    <div className="flex space-x-4 items-center pl-5 pr-5 pt-5">
                      <Avatar src={userInfo.profile.photo ? userInfo.profile.photo : ''} />
                      <h1 className='text-xl font-bold text-gray-600'>{userInfo.profile.name}</h1>
                    </div>
                    <div className='flex justify-center'>
                      <h1 className='text-gray-500 text-lg'>{userInfo.profile.mobile}</h1>
                    </div>
                    <div className="flex justify-center">
                      <Button>
                        <Link to={`/user/${userInfo.profile.id}`}>Visit profile</Link>
                      </Button>
                    </div>
                  </>
              }

              <Divider />
              <div className='flex justify-center'>
                <Button startIcon={<BookmarkBorderIcon />}
                  onClick={() => funcSave(details.product_id)}
                  size="large">
                  Save
                </Button>
                {/* <Button startIcon={<ContactsIcon/>}>
                  Contact
                </Button> */}
                <Button startIcon={<ContactsIcon />} onClick={handleClickOpen}>
                  Contact
                </Button>
              </div>
            </Paper>
          </div>
        </div>

        {/* 2nd flex */}
        <div className="product-description flex-grow-[3] ">
          <Paper elevation={15} sx={{ padding: "16px", height: "auto" }}>
            <div className="headerInfo" >
              <Typography variant="h4" gutterBottom>{details.title}</Typography>
              {/* <Typography variant="h5" gutterBottom>Description</Typography> */}
              {/* <Typography variant="h5" gutterBottom>Comment</Typography> */}
              <Button sx={{ fontSize: "1rem" }} onClick={handleClick}>Description</Button>
              <Button sx={{ fontSize: "1rem" }} onClick={handleClick}>Comment</Button>

              <Divider sx={{ marginBottom: "10px" }} />
            </div>


            {showDesc &&
              <div className="show-desc" >
                <div className='descrip'>
                  <Typography variant="body">{details.description}</Typography>
                </div>

                <div className="general mt-5">
                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>General</Typography>
                  <Paper elevation={15} sx={{ background: "#eee", marginBottom: "10px", padding: "10px" }}>
                    <Typography variant="body" gutterBottom>Delivery:  {details.home_delivery ? 'Available' : 'Not Available'}</Typography>
                    <Typography varaint="body" gutterBottom>Negotiable: {details.price_negotiable ? 'Negotiable' : "Not Negotiable"}</Typography>
                  </Paper>

                </div>
                <div className="specification mt-7 ">
                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>Specification</Typography>
                  <Paper elevation={15} sx={{ background: "#eee", marginBottom: "10px", padding: "10px" }}>
                    {
                      specification.map((data, index) => (
                        <h1 key={index}>{data.product_attribute.attribute_name}: {data.attribute_value}</h1>
                      ))
                    }
                  </Paper>
                </div>
              </div>
            }
            {
              showDesc === false &&
              <Comment productId={id} />
            }


          </Paper>
        </div>



        {/* 3rd flex */}
        <div className="similar-product w-[30rem] ">
          <Paper>
            <Typography variant="h5" gutterBottom>Similar Product</Typography>
            <Divider />
            <Grid container sx={{ mt: 2, mb: 2 }} spacing={3} direction="row">

              <SimilarProduct type={type.type_name}  />

            </Grid>
          </Paper>

        </div>




      </div>
    </>
  )
}

export default Description