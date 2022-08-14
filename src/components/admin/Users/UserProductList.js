import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../utils/auth'
import images from '../../../assets/images'
import { Card, CardHeader, CardMedia, Divider, Grid, IconButton, Typography, Snackbar, Alert } from '@mui/material'
import { Container } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { makeStyles } from '@mui/styles'


const useSyles = makeStyles({
    img: {
        height: "20rem",
        objectFit: 'cover',
        backgroundSize: "cover"
    },
})

const UserProductList = () => {
    let { id } = useParams();
    const [userProduct, setUserProduct] = useState([]);
    const [img, setImg] = useState([])
    const auth = useAuth();
    const classes = useSyles();
    // const [error, setError] = useState('')
    // const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/profile/${id}/ads-listing-visitor/`, {
            headers: {
                Authorization: `Bearer ${auth.access}`
            }
        })
            .then(response => {
                // console.log(response.data)
                setUserProduct(response.data)
            })
            .catch(error => {
                console.log(error.message)
            //    if(error){
            //        setError(error.message)
            //    }
            })
    }, [id])












    useEffect(() => {
        axios.get('http://localhost:8000/api/media/')
            .then(response => {
                console.log(response.data)
                setImg(response.data)

            }).catch(error => console.log(error))
    }, [])


    // if(error){
    //     navigate('users')
    // }

    function showImg(pr_id) {
        let src;
        img.filter(res => {
            if (res.product === pr_id) {
                src = res.image_url
            }
            return null
        })
        return src

    }



    if (userProduct.length < 1) return "Nothing was uploaded"

    return (
        <Container fixed>
            {userProduct.map((item, index) => (
                <Card key={index} elevation={1} sx={{ maxWidth: 345, marginLeft: "9px", marginBottom: "10px" }}>
                    {/* <Link to={`/${item.product_id}`}> */}
                    <CardMedia
                        component="img"
                        className={classes.img}
                        image={showImg(item.product_id) === undefined ? images[0] : showImg(item.product_id)}
                        alt="pic" />
                    <Divider />
                    <CardHeader
                        action={
                            <>
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </>
                        }
                        title={item.title}
                        subheader={item.condition}
                    />
                    <div className='flex justify-between items-between'>
                        <Typography sx={{ ml: 2 }} variant="h6">Rs {item.price}</Typography>
                    </div>
                    {/* </Link> */}
                </Card>


            ))}
        </Container>
    )
}

export default UserProductList