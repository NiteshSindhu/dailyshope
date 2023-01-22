import { Box, Button, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Styles from "./SingleProduct.module.css";
import { Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function SingleProduct() {
  const user = useSelector((user) => user.loginAuth.user);
  const [data, setData] = useState({});
  const [cartdata,setCartdata]=useState(JSON.parse(localStorage.getItem("cart"))||user.cartitem)
  const [whit, setWhit] = useState(true);
  console.log(user.cartitem);
  const { id } = useParams();
  const ref = useRef(null);
  const Setwhitlist = async () => {
    setWhit(!whit);
    
    try {
      const res = await axios.post(
        `http://localhost:8080/wishlist/add/${user._id}`,
        data
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const getdata = async (id) => {
    try {
      const res = await axios(`http://localhost:8080/products/${id}`);
      setData(res.data.totalProduct);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getdata(id);
  }, [id]);

  const addtocart = async () => {
    const cartlist = cartdata.filter(elem => elem._id === data._id);
    try {
      if (cartlist.length > 0) alert("Already Add in Cart");
      else {
        const res = await axios.post(
          `http://localhost:8080/cart/add/${user._id}`,
          data
          );
          setCartdata([...cartdata, data]);
          localStorage.setItem("cart", JSON.stringify(cartdata));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {data._id ? (
        <Box
          w="90%"
          display={{ lg: "flex", md: "flex", base: "block" }}
          className={Styles.main}
        >
          <Box>
            <Image src={data.img1} ref={ref} />
            <HStack>
              <Image
                src={data.img1}
                onClick={() => {
                  ref.current.src = data.img1;
                }}
              />
              <Image
                src={data.img2}
                onClick={() => {
                  ref.current.src = data.img2;
                }}
              />
            </HStack>
            {whit ? (
              <BsHeartFill
                className={`${Styles.icon} ${Styles.icon2}`}
                onClick={Setwhitlist}
              />
            ) : (
              <BsHeart
                className={`${Styles.icon} ${Styles.icon1}`}
                onClick={Setwhitlist}
              />
            )}
          </Box>
          <Box>
            <Text as="h2">{data.title}</Text>
            <HStack>
              <Text as="h3">₹.{data.price}</Text>
              <Text as="h3">{data.strike}</Text>
              <Text as="p">Inclusive of all taxes</Text>
            </HStack>
            <HStack>
              <Text as="p">Extra 10% cashback upto INR 500 with</Text>
              <Image
                src="https://images.dailyobjects.com/marche/icons/zest-updated.png?tr=cm-pad_resize,v-2,h-18,dpr-1"
                w="40px"
                h="20px"
              />
            </HStack>
            <Button onClick={addtocart} disabled={data.stocks<=0?true:false} className={data.stocks<=0?Styles.btn1:Styles.btn}>{data.stocks<=0?"NOTIFY SOON":"ADD TO CART"}</Button>

          </Box>
        </Box>
      ) : (
          <VStack w="100%" minH="500px" alignItems="center" justifyContent="center">
        <Spinner
          thickness="5px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          />
          </VStack>
      )}
    </>
  );
}
