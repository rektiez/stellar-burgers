import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '@selectors';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const { id } = useParams<{ id: string }>();

  const ingredientData =
    ingredients.find((ingredient) => ingredient._id === id) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
