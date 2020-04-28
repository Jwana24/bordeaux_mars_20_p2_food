import React from 'react';
import styles from "./MiniRecipe.module.css";

const MiniRecipe = (props) => {
    return (
        <div className={styles.MiniRecipe}>
            <div className={styles.ContainerMiniRecipeImg}>
                <img src={props.image} alt="Recipe"/>
            </div>
            <div className={styles.RecipeImage}>
                <div className={styles.RecipeImg}><img src="../../../Images/Icone/icon-like-orange@2x.png" alt="like it"/></div>
                <div className={styles.RecipeLike}><small>{props.aggregateLikes}</small></div>
            </div>
            <div className={styles.RecipeTitle}><p>{props.title}</p></div>
        </div>
    )
}

export default MiniRecipe;