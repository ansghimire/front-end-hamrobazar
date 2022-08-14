import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Divider, Grid, Paper, Typography, Card, CardHeader, CardMedia,IconButton } from '@mui/material'
// import {  Grid, IconButton, Typography,Snackbar,Alert } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom'
import images from '../../assets/images'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const useSyles = makeStyles({

    makeSticky: {
        height: "10rem",
        width: "10rem",
        position: "sticky",
        top: "4rem",
    }
})

const Search = () => {
    const [searchProduct, setSearchProduct] = useState([])
    const [img, setImg] = useState([])
    const classes = useSyles();
    const [searchParams] = useSearchParams();
    let search = searchParams.get('q')
    search = search.trim()


    useEffect(() => {
        axios.get(`http://localhost:8000/api/product/?search=${search}`)
            .then(response => {
                console.log(response.data)
                setSearchProduct(response.data)

            }).catch(error => {
                console.log(error)
            })
    }, [search])

    useEffect(() => {
        axios.get('http://localhost:8000/api/media/')
            .then(response => {
                console.log(response.data)
                setImg(response.data)

            }).catch(error => console.log(error))
    }, [])

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

    // if(searchProduct) return 'Loading'



    return (
        <>
            <UserLayout />

            <Container fixed>
                <div className='lg:w-auto md:w-auto '>
                    <Grid container sx={{ mt: 2 }} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item xs={8}>
                            <Paper elevation={2}>
                                <Typography variant="h6" sx={{
                                    color: 'black',
                                    marginBottom: '8px',
                                    borderRight: '2px solid black'
                                }} >
                                    You Search For : {search}
                                </Typography>
                                <Divider sx={{ backgroundColor: 'black', border: '2px solid black' }} />

                                {
                                    searchProduct.length < 1 ? " No Data found" :
                                        <Grid container sx={{ mt: 2, mb: 2 }} spacing={3}
                                        >
                                            {/* showing all the productlist */}

                                            {
                                                searchProduct.map((item, index) => (
                                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                                        <Card elevation={1} sx={{ maxWidth: 345, marginLeft: "9px", marginBottom: "10px" }}>
                                                            <Link to={`/${item.product_id}`}>
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

                                                            </Link>
                                                        </Card>

                                                    </Grid>
                                                ))
                                            }
                                            {/* <ProductList/> */}
                                        </Grid>
                                }
                            </Paper>
                        </Grid>

                        <Grid item xs={4} className={classes.makeSticky}>
                            <Paper elevation={15} sx={{ height: "88vh", padding: "1rem 3rem" }}>
                                <Typography sx={{ fontSize: "13px" }}>copyright@2022, Hamro Nepali Market</Typography>
                            </Paper>
                        </Grid>



                    </Grid>
                </div>
            </Container>


        </>
    )
}

export default Search
