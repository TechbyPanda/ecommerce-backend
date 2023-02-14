# Authentication Error Handling

```
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({message: 'error in server'});
  }
})
```