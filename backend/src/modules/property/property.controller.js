import {
  createProperty,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty,
} from "./property.service.js";

const serialize = (p) => ({
  id: p._id,
  name: p.name,
  ownerName: p.ownerName,
  phone: p.phone,
  addressLine1: p.addressLine1,
  addressLine2: p.addressLine2,
  location: p.location,
  pincode: p.pincode,
  createdAt: p.createdAt,
});

export const createPropertyController = async (req, res, next) => {
  try {
    const {
      name,
      ownerName,
      phone,
      addressLine1,
      addressLine2,
      location,
      pincode,
    } = req.body;
    const property = await createProperty({
      ownerId: req.owner.id,
      name,
      ownerName,
      phone,
      addressLine1,
      addressLine2,
      location,
      pincode,
    });
    return res.status(201).json(serialize(property));
  } catch (error) {
    next(error);
  }
};

export const getPropertiesController = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const { data, meta } = await getPropertiesByOwner({
      ownerId: req.owner.id,
      page,
      limit,
    });
    return res.status(200).json({ data: data.map(serialize), meta });
  } catch (error) {
    next(error);
  }
};

export const updatePropertyController = async (req, res, next) => {
  try {
    const {
      name,
      ownerName,
      phone,
      addressLine1,
      addressLine2,
      location,
      pincode,
    } = req.body;
    const property = await updateProperty({
      ownerId: req.owner.id,
      propertyId: req.params.propertyId,
      name,
      ownerName,
      phone,
      addressLine1,
      addressLine2,
      location,
      pincode,
    });
    return res.status(200).json(serialize(property));
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
