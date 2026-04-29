import { Add, DeleteOutlined, Remove, ShoppingCartCheckout } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { itemsApi } from '../api/itemsApi';
import { ordersApi } from '../api/ordersApi';
import type { RootState } from '../app/store';
import { addToCart, clearCart, removeFromCart, updateQuantity } from '../features/cart/cartSlice';

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: allItems = [] } = useQuery({ queryKey: ['items'], queryFn: itemsApi.getItems });
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkoutMutation = useMutation({
    mutationFn: async (address: string) => {
      const order = {
        items: cartItems.map((item) => ({
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        address,
        orderDate: new Date().toISOString(),
        shopProfit: 0,
      };
      return ordersApi.createOrder(order);
    },
    onSuccess: () => {
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('ההזמנה בוצעה בהצלחה!');
    },
    onError: () => {
      toast.error('ביצוע ההזמנה נכשל');
    },
  });

  const handleCheckout = () => {
    const uniqueItems = cartItems.length;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (uniqueItems > 10) {
      toast.error('הזמנה לא יכולה להכיל יותר מ-10 מוצרים שונים');
      return;
    }
    if (totalQuantity > 50) {
      toast.error('הזמנה לא יכולה להכיל יותר מ-50 פריטים סה"כ');
      return;
    }

    const address = prompt('נא להזין כתובת למשלוח:');
    if (address) {
      checkoutMutation.mutate(address);
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('הוסר מהסל');
  };

  const handleUpdateQuantity = (id: string, quantity: number, maxStock: number) => {
    if (quantity > maxStock) {
      toast.error(`יש רק ${maxStock} יחידות במלאי`);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('הסל רוקן');
  };

  const cartCategories = [...new Set(cartItems.map((item) => item.category))];
  const recommendations = allItems
    .filter((item) => cartCategories.includes(item.category) && !cartItems.some((cartItem) => cartItem.id === item.id) && item.stock > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }} dir="rtl">
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, background: 'linear-gradient(45deg, #8b5cf6 30%, #ec4899 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
        סל הקניות שלך
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', background: 'rgba(30, 33, 48, 0.5)', borderRadius: 4 }}>
              <ShoppingCartCheckout sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary">הסל שלך ריק לחלוטין.</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>גלו מוצרים מדהימים בחנות שלנו.</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cartItems.map((item) => (
                <Card key={item.id} sx={{ display: 'flex', borderRadius: 4, background: 'linear-gradient(145deg, #1e2130, #262a3d)', overflow: 'visible', position: 'relative', flexDirection: 'row-reverse' }}>
                  <CardMedia component="img" sx={{ width: 140, objectFit: 'cover', borderTopRightRadius: 16, borderBottomRightRadius: 16 }} image={item.image} alt={item.name} />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 3, px: 4, textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                      <IconButton color="error" onClick={() => handleRemove(item.id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" color="primary.light" sx={{ fontWeight: 800, mt: 1 }}>${item.price.toFixed(2)}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexDirection: 'row-reverse' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 8, p: 0.5 }}>
                        <IconButton size="small" disabled={item.quantity <= 1} onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.stock)}>
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(event) => handleUpdateQuantity(item.id, Math.max(1, Number(event.target.value)), item.stock)}
                          variant="standard"
                          slotProps={{
                            input: { disableUnderline: true },
                            htmlInput: { style: { textAlign: 'center', width: '40px', fontWeight: 'bold' } }
                          }}
                        />
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.stock)}>
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary">סה"כ: ${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(30, 33, 48, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 100, textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>סיכום הזמנה</Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexDirection: 'row-reverse' }}>
              <Typography color="text.secondary">מוצרים ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)})</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexDirection: 'row-reverse' }}>
              <Typography color="text.secondary">משלוח</Typography>
              <Typography color="success.main" sx={{ fontWeight: 'bold' }}>חינם</Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexDirection: 'row-reverse' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>סה"כ</Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || checkoutMutation.isPending}
              sx={{ py: 1.5, borderRadius: 8, fontWeight: 700, fontSize: '1.1rem', mb: 2 }}
            >
              {checkoutMutation.isPending ? 'מעבד...' : 'המשך לתשלום'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
              sx={{ borderRadius: 8 }}
            >
              רוקן סל
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {recommendations.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'right' }}>אולי תאהבו גם</Typography>
          <Grid container spacing={3} sx={{ flexDirection: 'row-reverse' }}>
            {recommendations.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                  <CardMedia component="img" height="180" image={item.image} alt={item.name} sx={{ objectFit: 'cover' }} />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    <Typography variant="h6" color="primary.light">${item.price.toFixed(2)}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(addToCart({ item, quantity: 1 }));
                        toast.success('נוסף לסל');
                      }}
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      הוסף לסל
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
