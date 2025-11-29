import { Dog } from "../models/Dog.js";

export const registerDog_post = async (req, res) => {
  const { name, description } = req.body;
  const userId = res.locals.userId;

  try {
    const newDog = await Dog.create({
      name,
      description,
      isAdopted: false,
      registeredUser: userId,
    });
    res.status(201).json({ dogId: newDog._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering dog", error: err.message });
  }
};

export const adoptDog_post = async (req, res) => {
  const { dogId, message } = req.body;
  const userId = res.locals.userId;

  try {
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    if (dog.isAdopted) {
      return res.status(400).json({ message: "Dog already adopted" });
    }
    if (dog.registeredUser === userId) {
      return res
        .status(400)
        .json({ message: "You cannot adopt your own registered dog" });
    }

    dog.isAdopted = true;
    dog.message = message;
    await dog.save();

    res.status(200).json({ message: "Dog adopted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adopting dog", error: err.message });
  }
};

export const removedDog_delete = async (req, res) => {
  const { dogId } = req.body;
  const userId = res.locals.userId;

  try {
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    if (dog.registeredUser !== userId) {
      return res
        .status(403)
        .json({ message: "You can only remove your own registered dogs" });
    }

    await Dog.findByIdAndDelete(dogId);

    res.status(200).json({ message: "Dog removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing dog", error: err.message });
  }
};

export const getDogs_get = async (req, res) => {
  const { page = 0, isAdopted = undefined, myDogs = undefined } = req.query;
  const ITEMS_PER_PAGE = 3;
  const filters = {};
  if (isAdopted !== undefined) filters.isAdopted = isAdopted === "true";
  if (myDogs) filters.registeredUser = res.locals.userId;
  Dog.find(filters)
    .skip(page * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((dogs) => {
      res.status(200).json(dogs);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching dogs", error: err.message });
    });
};
