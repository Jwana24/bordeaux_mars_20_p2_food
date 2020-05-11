import { withStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Tooltip from '@material-ui/core/Tooltip'
import Fade from '@material-ui/core/Fade';
import styles from "./RecipeModal.module.css";
import axios from 'axios';
import NutritionInfo from './NutritionInfo';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#F29B20',
    color:'white',
    fontSize: 14,
    fontFamily:'Rubik',
    fontWeight: 'bold'
  },
  arrow : {
    color: '#F29B20'
  }
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '80px',
  },
  
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0px 3px 10px black",
    // padding: theme.spacing(2, 4, 3),
    width: '885px',
    height: '700px',
    padding: '0px',
    overflow: 'scroll',
    overflowY: 'auto',
    overflowX: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '360px',
      height: '665px',
    },
    [theme.breakpoints.up('sm')]: {
      width: '630px',
      height: '750px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '885px',
      height: '700px',
    },
    [theme.breakpoints.up('xl')]: {
      width: '900px',
      height: '700px',
    },
  },
}));


export default function TransitionsModal(props) {
  const { dataRecipe} = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState([]);
  const [nutrition, setNutrition] = useState({}); //nutrition elements with the extended search (dietetic search page)
  const [diet, setDiet ] = useState([]); //nutrition eements with the basico search (In my fridge page)
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${dataRecipe}`
    axios
      .get(
        url,
      {
        headers: {
          "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": "788f9512demsh2ae41414a86ef90p1a01bcjsn23eee9f9e33b"
        }
      }
    )
    .then(response => response.data)
    .then(data => setRecipe(data))
    .catch((err) => {
      console.log(err);
    })
  }, [dataRecipe])

  useEffect(() => {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${dataRecipe}/nutritionWidget.json`;
    axios
      .get(
        url,
        {
          headers: {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "788f9512demsh2ae41414a86ef90p1a01bcjsn23eee9f9e33b"
          }
        }
      )
      .then(response => response.data)
      .then(data => {
        const newArray = data.good.concat(data.bad)
        const finalArray = newArray.filter(element => {
          switch(element.title) {
            case 'Protein':
              return element;
              break;
            case 'Fat':
              return element;
              break;
            case 'Carbohydrates':
              return element;
              break;
            case 'Calories':
              return element;
              break;
          }
        })
        setNutrition(data)
        setDiet(finalArray)
        })
      .catch((err) => {
        console.log(err);
      })
  }, [dataRecipe])

  console.log(diet);

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        {/* Read More */}
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>

            <div className={styles.ContainerModalFlex}>
              <img className={styles.closeButton} onClick={handleClose} src="../../../../Images/Icone/icon-close-white@2x.png" alt ="close modal"/>
              <div 
                className={styles.divImg}
                style={{ backgroundImage:`url(${recipe.map(element => element.image)})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: "300px",
                width: "885px"
                  }}
              />

              <div className={styles.RecipeTitle}>
                <div>
                  <h1 className={styles.title} id="transition-modal-title">{recipe.map(element => element.title)}</h1>
                </div>
                <div className={styles.RecipeIcon}>
                  <div>
                      <img src="../../../../Images/Icone/icon-cook-time@2x.png"alt="icone-cooking-min"/>
                      {recipe.map(element => element.cookingMinutes !== undefined
                      ? <small>Cook {recipe.map(element => element.cookingMinutes)} min</small>
                      : <small>no cooking time</small>
                      )} 
                  </div>
                  <div>
                    <img src="../../../../Images/Icone/icon-people-count@2x.png"alt="icone-cooking-min"/>
                    <small>{recipe.map(element => element.servings)} people</small>
                  </div>
                  <div>


                  <img src="../../../../Images/Icone/icon-prep-time@2x.png"alt="icone-cooking-min"/>
                    {recipe.map(element => element.preparationMinutes !== undefined
                    ? <small> Prep {recipe.map(element => element.preparationMinutes)} min</small>
                    : <small>no prep. time</small>
                    )}
                  </div>

                </div>
              </div>
                <div className={styles.NutritionContainer}>
                  {/* <LightTooltip title='Calories' arrow>
                    <div>
                      <img className={styles.NutritionImg} src="../../../../Images/Icone/icone-kcal2x.png" alt="calories"/>
                      <small>{nutrition.calories}</small>
                    </div>
                  </LightTooltip>
                  
                  <LightTooltip title='Fat' arrow>
                  <div>
                    <img className={styles.NutritionImg} src="../../../../Images/Icone/icone-fat2x.png" alt="fat"/>
                    <small>{nutrition.fat}</small>
                  </div> 
                  </LightTooltip>
                  
                  <div>
                    <img className={styles.NutritionImg} src="../../../../Images/Icone/icone-carbs2x.png" alt="carbs"/>
                    <small>{nutrition.carbs}</small>
                  </div>
                
                  <div >
                    <img className={styles.NutritionImg} src="../../../../Images/Icone/icone-prot2x.png" alt="protein"/>
                    <small>{nutrition.protein}</small>
                  </div> */}

                 
                 

                 {/* If its a complexe nutrition, set specific categories, if not set the other one */}
                  {
                    props.complexeNutrition
                    ?  props.complexeNutrition.map(element => {
                      return <NutritionInfo
                              icon={element.title}
                              title={element.title}
                              amount={element.amount}
                              unit={element.unit}
                      />
                    })

                    : diet.map(element => {
                      return <NutritionInfo
                              icon={element.title}
                              title={element.title}
                              amount={element.amount}
                              unit={element.unit}
                      />
                    })
                  }                   
                
                </div>            
              </div>              
              <div className={styles.RecipeDetail}>
                <h2 className={styles.title2}>Ingredients list</h2><hr/>
                <div className={styles.ContainerListIngredients}>
                  <ul className={styles.orderList}>
                      {recipe.map(element => element.extendedIngredients.map(ingredient => <li>{ingredient.name}</li>))}                      
                  </ul>
                </div>

                <h2 className={styles.title2} >Instructions</h2><hr/>
                  <ol className={styles.InstructionsOl}>
                    {recipe.map(element => element.analyzedInstructions.length > 0 
                    ? recipe.map(element => element.analyzedInstructions.map(element2 => element2.steps.map(element3 => <li className={styles.InstructionsLi}>{element3.step}</li>)))
                    : <p className={styles.noSpecialInfo}>No special instructions</p>
                    )
                    }
                  </ol>
                <h2 className={styles.title2} >Diets</h2><hr/>
                  <ul className={styles.orderList}>
                    {recipe.map(element => element.diets.length > 0
                    ? recipe.map(element => element.diets.map(diet => <li>{diet}</li>))
                    : <p className={styles.noSpecialInfo}>No special diets</p>)}
                  </ul>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}