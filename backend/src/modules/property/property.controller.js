import {
  createProperty,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty,
} from "./property.service.js";

export const createPropertyController = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const property = await createProperty({
      ownerId: req.owner.id,
      name,
      address,
    });
    return res.status(201).json({
      id: property._id,
      name: property.name,
      address: property.address,
      createdAt: property.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertiesController = async (req, res, next) => {
  try {
    const properties = await getPropertiesByOwner({ ownerId: req.owner.id });
    return res.status(200).json(
      properties.map((p) => ({
        id: p._id,
        name: p.name,
        address: p.address,
      })),
    );
  } catch (error) {
    next(error);
  }
};

export const updatePropertyController = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const property = await updateProperty({
      ownerId: req.owner.id,
      propertyId: req.params.propertyId,
      name,
      address,
    });
    return res.status(200).json({
      id: property._id,
      name: property.name,
      address: property.address,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePropertyController = async (req, res, next) => {
  try {
    await deleteProperty({
      ownerId: req.owner.id,
      propertyId: req.params.propertyId,
    });
    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};
