import React, { useState, useEffect } from 'react'
import {
    Card, Grid, CardMedia, Divider, IconButton, CardHeader, Typography, Menu, MenuItem,
} from '@mui/material'
import axios from 'axios'
import { useAuth } from '../../../utils/auth'
import images from '../../../assets/images'
import { makeStyles } from '@mui/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update';
import { Link } from 'react-router-dom'
import DeductDialog from './DeductDialog'
import { UpdateDialog } from './UpdateDialog'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


const useSyles = makeStyles({
    img: {
        height: "10rem",
        objectFit: 'cover',
        backgroundSize: "cover"
    },
})


function Adpost() {

    const [adsList, setAdsList] = useState(null)
    const [img, setImg] = useState([])
    const auth = useAuth();
    const classes = useSyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openDeduct, setOpenDeduct] = React.useState(false);
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [qty, setQty] = React.useState(null);
    const [prId, setPrId] = React.useState(null);
    const [adId, setAdId] = React.useState(null);



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        if (auth.access) {
            axios.get('http://localhost:8000/api/profile/ads-listing', {
                headers: {
                    Authorization: `Bearer ${auth.access}`
                }
            }).then(response => {
                // console.log(response.data)
                setAdsList(response.data)
            }).catch(error => {
                console.log(error)
            })
        }

    }, [auth.access])

    useEffect(() => {
        if (auth.access) {
            axios.get('http://localhost:8000/api/media/', {
                headers: {
                    Authorization: `Bearer ${auth.access}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    setImg(response.data)

                }).catch(error => console.log(error))
        }

    }, [auth.access])


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

    if (!adsList) return 'No ADS added by you............'


    const handleClickOpen = (qty, pr_id) => {
        setOpenDeduct(true);

        setQty(qty);
        setPrId(pr_id);
    };

    const handleUpdateOpen = (adId) => {
        setOpenUpdate(true);
        setAdId(adId)
    }


    const handleSoldClose = () => {
        setOpenDeduct(false);
        setQty(null);
        setPrId(null);
    };

    const handleUpdateClose = () => {
        setOpenUpdate(false);
        setAdId(null)
    }


    const funcDelete = (pr_id) => {
        axios.delete(`http://localhost:8000/api/product/${pr_id}/`, {
            headers: {
                Authorization: `Bearer ${auth.access}`
            }
        }).then(response => {
            // if (response.data) {
            //     // setSuccess("Successfully deleted")
            // }
            console.log(response.data)
        }).catch(err => {
            // setError(err.response.data.detail)
        })
    }





    return (
        <>
            {

                adsList.map((item, index) => (
                    <Grid item key={index}>
                        <Card elevation={1} sx={{ maxWidth: 200, marginLeft: "9px", marginBottom: "10px" }}>
                            <CardMedia
                                component="img"
                                className={classes.img}
                                image={showImg(item.product_id) === undefined ? images[0] : showImg(item.product_id)}
                                alt="pic" />


                            <Divider />


                            <CardHeader
                                action={
                                    <>

                                        <IconButton
                                            id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon />
                                            {/* </IconButton> */}
                                        </IconButton>
                                        {/* <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                <Link to={`/add-product-img/${item.product_id}`}>
                                                    Add Image
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>     
                                                Deduct Sold Qty
                                            </MenuItem>
                                        </Menu> */}
                                    </>
                                }
                                title={item.title}
                                subheader={item.condition}
                                onClick={() => {

                                    handleClickOpen(item.quantity, item.product_id)
                                }}
                            />
                            {/* <Typography sx={{ ml: 2 }} variant="h6">Rs {item.price}</Typography>
                             */}
                            <div className='flex justify-between items-between'>
                                <Typography sx={{ ml: 2 }} variant="h6">Rs {item.price}</Typography>
                                <IconButton onClick={() => funcDelete(item.product_id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => handleUpdateOpen(item.product_id)}>
                                    <UpdateIcon />
                                </IconButton>
                                <IconButton >
                                    <Link to={`/add-product-img/${item.product_id}`}>
                                    <AddPhotoAlternateIcon />
                                    </Link>
                                </IconButton>
                            </div>
                        </Card>
                    </Grid>
                ))
            }

            {
                (qty && prId) &&
                <DeductDialog openDeduct={openDeduct} handleSoldClose={handleSoldClose} quantity={qty} pr_id={prId} />
            }

            {
                adId &&
                <UpdateDialog openUpdate={openUpdate} handleUpdateClose={handleUpdateClose} adId={adId} />
            }



        </>
    )
}

export default Adpost