 import express from 'express';

 const app = express();
 app.use(express.json());

 const PORT = 3000;

 const list = [
      { 
         id: 1, title: 'Assignments',
         status: 'pending'
      },
      {
         id: 2, title: 'Daily Chores',
         status: 'pending'
      }
 ]

 const items = [
      {
         id: 1, 
         list_id: 1,
         description: 'Programming',
         status: 'pending'
      },
      {
         id: 2,
         list_id: 1,
         description: 'Web Dev',
         status: 'pending'
      },
      {
         id: 3,
         list_id: 2,
         description: 'Wash Dish',
         status: 'pending'
      },
      {
         id: 4,  
         list_id: 2,
         description: 'Clean the Room',
         status: 'pending'
      }
 ]

    app.get('/get-list' , (req, res) => {
    res.status(200).json({success: true, list});
    });

    app.get('/get-items/:id', (req, res) => {
      const listId = req.params.id;

      const filtered = items.filter(
         item => item.list_id == listId
      );

      if(filtered.length === 0) {
         res.status(200).json({
            success: false,
            message: 'List not found.'
         });
      }

      res.status(200).json({success: true, items: filtered});
      });

    app.post('/add-list' , (req, res) => {
      const { listTitle} = req.body;

      list.push({
         id: list.length + 1,
         title: listTitle,
         status: 'pending'
      });

    res.status(200).json({success: true, list,  message: 'List added successfully.'});
    });

    app.get('/edit-list' ,(req, res) => {
    res.send('This is the Edit List Page');
    });

    app.get('/add-item' ,(req, res) => {
    res.send('This is the Add Item Page');
    });

    app.get('/edit-item' , (req, res) => {
    res.send('This is the Edit Item Page.');
    });

    app.get('/delete-item' ,(req, res) => {
    res.send('This is the Delete Item Page');
    });


    app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    }); 