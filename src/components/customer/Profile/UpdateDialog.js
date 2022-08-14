import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogActions, TextField,
  DialogTitle, DialogContentText, DialogContent, FormControl, InputLabel, Select, Menu, MenuItem, Button
} from '@mui/material'
import axios from 'axios'

import FormikControl from '../../common/formik/FormikControl'
import { Formik, Form, } from "formik";
import * as Yup from "yup";
import { useAuth } from '../../../utils/auth'

const dualOptions = [
  {
    key: 'Yes',
    value: true
  },
  {
    key: 'No',
    value: false
  },
]

const conditionOptions = [
  {
    key: 'Brand New(not used)',
    value: "Brand New(not used)"
  },
  {
    key: "LIKE New(used few times)",
    value: "LIKE New(used few times)"
  },
  {
    key: "Excellent",
    value: "Excellent",
  },
  {
    key: "Not Working",
    value: "Not Working"
  }
]



export const UpdateDialog = ({ adId, openUpdate, handleUpdateClose }) => {
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth();


  useEffect(() => {
    axios.get(`http://localhost:8000/api/product/${adId}/`)
      .then(response => {
        setAd(response.data)
        setLoading(false)

      }).catch(error => {
        console.log(error)
      })

  }, [adId])

  if (loading) return ""

  const oneValidationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    price_negotiable: Yup.string().required("Required"),
    condition: Yup.string().required("Required"),
    quantity: Yup.string().required("Required"),
  });

  const initialValues = {
    title: ad.title || '',
    description: ad.description || '',
    price: ad.price || '',
    price_negotiable: ad.price_negotiable || '',
    condition: ad.condition || '',
    quantity: ad.quantity || ''
  }


  const handleSubmit = (values) => {
    axios.patch(`http://localhost:8000/api/product/${adId}/`, values,
    {
      headers: {
        Authorization: `Bearer ${auth.access}`
      }
    })
    .then(response => {
     console.log(response.data)
     handleUpdateClose()
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <div>
      <Dialog open={openUpdate} onClose={handleUpdateClose}>

        <DialogTitle>Update  Your Ads</DialogTitle>
        <Formik initialValues={initialValues}
          validationSchema={oneValidationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <DialogContent>
                <FormikControl
                  name="title"
                  control="materialInput"
                  label="Title"
                  type="text"
                /> 
                &nbsp; &nbsp;
                
                <FormikControl
                  name="description"
                  control="materialInput"
                  label="Description"
                  type="textarea"
                  multiline={true}
                  minRows={6}
                  maxRows={6}
                  sx={{ width: 300 }}
                />
                <FormikControl
                  name="price"
                  control="materialInput"
                  label="Price"
                  type="number"
                />
                     &nbsp; &nbsp;
                <FormikControl
                  name="quantity"
                  control="materialInput"
                  label="Quantity"
                  type="number"
                />

                <FormikControl
                  name="price_negotiable"
                  control="radioBtn"
                  label="Price Negotiable"
                  options={dualOptions}
                />
                <FormikControl
                  name="condition"
                  control="materialSelect"
                  label="Condition"
                  type="text"
                  options={conditionOptions}
                  sx={{ width: 215 }}
                />

              </DialogContent>
              <DialogActions>
                <Button onClick={handleUpdateClose}>Cancel</Button>
                <Button  variant="contained" type="submit">Update</Button>
              </DialogActions>

            </Form>

          )}


        </Formik>
      </Dialog>

    </div>
  )
}
